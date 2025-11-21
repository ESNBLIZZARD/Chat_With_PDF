import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import { processPDF } from "./pdfProcessor.js";
import { qdrant, COLLECTION } from "./qdrant.js";
import { genAI } from "./ai.js";
import { ensureCollection } from "./createCollection.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const upload = multer({ storage: multer.memoryStorage() });

const EMBEDDING_DIM = Number(process.env.EMBEDDING_DIM || 1536);

// Ensure Qdrant collection
ensureCollection(EMBEDDING_DIM)
  .then(() => console.log("Qdrant collection ready"))
  .catch((err) =>
    console.warn("Could not ensure collection:", err?.message || err)
  );

// ------------------------------------------------------
// 📌 1) UPLOAD PDF → CHUNK → EMBED → STORE IN QDRANT
// ------------------------------------------------------
app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded" });

    const { chunks } = await processPDF(req.file.buffer, 1000);
    if (!chunks.length)
      return res.status(400).json({ error: "No text extracted from PDF" });

    const embedder = genAI.getGenerativeModel({ model: "text-embedding-004" });

    const points = [];

    for (let i = 0; i < chunks.length; i++) {
      const text = chunks[i];

      try {
        const emb = await embedder.embedContent(text);

        const vector =
          emb?.embedding?.values ||
          emb?.embedding ||
          emb?.data?.[0]?.embedding ||
          null;

        if (!Array.isArray(vector)) {
          console.warn("Skipping invalid embedding at chunk", i);
          continue;
        }

        points.push({
          id: uuidv4(),
          vector,
          payload: { text },
        });
      } catch (err) {
        console.warn("Embedding failed at chunk", i, err?.message);
      }
    }

    if (!points.length)
      return res.status(500).json({ error: "No embeddings were created" });

    await qdrant.upsert(COLLECTION, { wait: true, points });

    res.json({
      message: "PDF processed and stored",
      chunks: points.length,
    });
  } catch (err) {
    console.error("❌ PDF upload error:", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

// ------------------------------------------------------
// 📌 2) ASK ENDPOINT — SEARCH CHUNKS + GENERATE ANSWER
// ------------------------------------------------------
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question)
      return res.status(400).json({ error: "Question is required" });

    // 🔹 Embed query
    const embedder = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const emb = await embedder.embedContent(question);

    const queryVector =
      emb?.embedding?.values ||
      emb?.embedding ||
      emb?.data?.[0]?.embedding ||
      null;

    if (!Array.isArray(queryVector))
      return res.status(500).json({ error: "Failed to embed query" });

    // 🔹 Search Qdrant
    const results = await qdrant.search(COLLECTION, {
      vector: queryVector,
      limit: 3,
    });

    const context = results.map((item) => item.payload.text).join("\n");

    // 🔹 Generate answer
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const aiResponse = await model.generateContent(
      `Use only the following extracted PDF text:\n\n${context}\n\nUser Question: ${question}\n\nAnswer clearly:`
    );

    const answer = aiResponse?.response?.text() || "No answer generated.";

    res.json({ answer });
  } catch (err) {
    console.error("❌ Ask endpoint error:", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

// ------------------------------------------------------
const PORT = process.env.PORT || 5000;
async function testModel() {
  try {
    const m = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const r = await m.generateContent({
      contents: [{ parts: [{ text: "Hello" }] }],
    });
    console.log("Model OK:", r.response.text());
  } catch (e) {
    console.error("MODEL TEST FAILED:", e.message);
  }
}

testModel();

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
