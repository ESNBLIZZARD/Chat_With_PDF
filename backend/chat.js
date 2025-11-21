import { genAI } from "./ai.js";
import { qdrant, COLLECTION } from "./qdrant.js";

function normalizeEmbedding(embedResult) {
  if (!embedResult) return null;

  return (
    embedResult?.embedding?.values ||
    embedResult?.embedding ||
    embedResult?.data?.[0]?.embedding ||
    null
  );
}

export async function chatWithDocs(prompt, topK = 5) {
  if (!prompt) throw new Error("Prompt is required");

  // ---- Embed query ----
  const embedder = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const embRes = await embedder.embedContent(prompt);

  const vector = normalizeEmbedding(embRes);
  if (!Array.isArray(vector)) throw new Error("Invalid embedding vector");

  // ---- Qdrant search ----
  const results = await qdrant.search(COLLECTION, {
    vector,
    limit: topK,
  });

  if (!results.length) return "No relevant information found.";

  const context = results.map(r => r.payload?.text || "").join("\n\n");

  // ---- Generate answer ----
  const model = genAI.getGenerativeModel({
     model: 'gemini-2.5-flash',
  });

  const finalPrompt = `
Use ONLY the following document context to answer.

Context:
${context}

Question:
${prompt}
  `;

  const result = await model.generateContent(finalPrompt);
  const text = result?.response?.text?.() || result?.response?.text;

  return text || "No answer generated.";
}
