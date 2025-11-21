import React, { useState } from "react";
import "./App.css";
import FileUpload from "./components/FileUpload";
import ChatBox from "./components/ChatBox";

function App() {
  const [pdfUploaded, setPdfUploaded] = useState(false);

  return (
    <div className="container flex">
      <h1>Chat With PDF</h1>

      <FileUpload onUploadSuccess={() => setPdfUploaded(true)} />

      {pdfUploaded && <ChatBox />}
    </div>
  );
}

export default App;
