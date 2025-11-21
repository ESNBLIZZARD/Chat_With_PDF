import { qdrant } from "./qdrant.js";

async function deleteCol() {
  try {
    await qdrant.deleteCollection("company_docs");
    console.log("Deleted collection.");
  } catch (err) {
    console.error("Delete failed:", err?.message || err);
  }
}

deleteCol();
