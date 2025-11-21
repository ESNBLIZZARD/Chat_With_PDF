import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export async function processPDF(buffer, chunkSize = 1000) {
  if (!buffer || !(buffer instanceof Buffer)) {
    throw new Error("processPDF expects a Buffer");
  }

  const data = await pdfParse(buffer);
  const text = data?.text || "";

  // Normalize whitespace
  const normalized = text.replace(/\s+/g, " ").trim();

  // Simple chunker by characters (keeps sentences roughly)
  const chunks = [];
  for (let i = 0; i < normalized.length; i += chunkSize) {
    chunks.push(normalized.slice(i, i + chunkSize));
  }

  return { text: normalized, chunks };
}
