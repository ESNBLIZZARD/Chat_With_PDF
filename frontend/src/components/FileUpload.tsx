import React, { useState } from "react";
import { uploadPDF } from "../api";

interface FileUploadProps {
  onUploadSuccess: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setFile(e.target.files[0]);
  };

  const uploadHandler = async () => {
    if (!file) return;

    setLoading(true);
    try {
      await uploadPDF(file);
      onUploadSuccess();
      alert("PDF Uploaded Successfully!");
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
    setLoading(false);
  };

  return (
    <div className="upload-box">
      <h3>Upload PDF</h3>

      <input type="file" accept="application/pdf" onChange={handleFileChange} />

      <button onClick={uploadHandler} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default FileUpload;
