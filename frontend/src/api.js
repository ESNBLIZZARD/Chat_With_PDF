import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const uploadPDF = (file) => {
  const formData = new FormData();
  formData.append("pdf", file);

  return API.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const askQuestion = (question) => {
  return API.post("/ask", { question });
};
