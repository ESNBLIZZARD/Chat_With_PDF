import React, { useState } from "react";
import { uploadPDF } from "../api";
import { Upload, FileText } from "lucide-react";

interface FileUploadProps {
  onUploadSuccess: () => void;
  darkMode: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess, darkMode }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
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

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      className={`rounded-2xl shadow-lg p-8 mb-6 border ${darkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-100"
        }`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`p-3 rounded-xl ${darkMode ? "bg-blue-900" : "bg-blue-100"
            }`}
        >
          <Upload
            className={`w-6 h-6 ${darkMode ? "text-blue-400" : "text-blue-600"
              }`}
          />
        </div>
        <h3 className={`text-xl font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
          Upload PDF Document
        </h3>
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : darkMode
              ? "border-gray-600 bg-gray-700/50 hover:border-gray-500"
              : "border-gray-300 bg-gray-50 hover:border-gray-400"
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" id="file-upload" />

        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-3">
            <div className={`${darkMode ? "bg-gray-700" : "bg-white"} p-4 rounded-full shadow-sm`}>
              <FileText className={`w-8 h-8 ${darkMode ? "text-gray-400" : "text-gray-400"}`} />
            </div>
            <div>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} font-medium`}>
                {file ? file.name : "Drop your PDF here or click to browse"}
              </p>
              <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"} mt-1`}>PDF files only</p>
            </div>
          </div>
        </label>
      </div>

      {file && (
        <button
          onClick={uploadHandler}
          disabled={loading}
          className="mt-6 w-full bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
        >
          {loading ? "Uploading..." : "Upload PDF"}
        </button>
      )}
    </div>
  );
};

export default FileUpload;
