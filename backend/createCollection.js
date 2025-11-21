import { COLLECTION, qdrant } from "./qdrant.js";

export async function ensureCollection(dim = 1536) {
  try {
    // Try to create (if already exists this may throw)
    await qdrant.createCollection(COLLECTION, {
      vectors: {
        size: dim,
        distance: "Cosine",
      }
    });
    console.log("Created collection:", COLLECTION, "dim:", dim);
  } catch (err) {
    // If it exists, Qdrant returns error — we ignore that
    const msg = err?.data?.status?.error || err.message || String(err);
    if (msg.toLowerCase().includes("already exists") || msg.toLowerCase().includes("exists")) {
      console.log("Collection already exists:", COLLECTION);
    } else {
      console.warn("Ensure collection warning:", msg);
    }
  }
}
