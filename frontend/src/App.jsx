import { useEffect, useState } from "react";
import "./index.css";
import FileUpload from "./components/FileUpload";
import ChatBox from "./components/ChatBox";
import { FileText, Moon, Sun } from "lucide-react";

function App() {
  const [pdfUploaded, setPdfUploaded] = useState(false);

 const [darkMode, setDarkMode] = useState(() => {
  const saved = localStorage.getItem("darkMode");
  return saved === "true";
});


  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-linear-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-linear-to-br from-blue-50 via-white to-purple-50"
      } py-12 px-4 transition-colors duration-300`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 relative">
          <button
            onClick={toggleDarkMode}
            className={`absolute right-0 top-0 p-3 rounded-xl ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-white hover:bg-gray-100"
            } shadow-lg transition-all duration-200`}
          >
            {darkMode ? (
              <Sun className="w-6 h-6 text-yellow-400" />
            ) : (
              <Moon className="w-6 h-6 text-gray-600" />
            )}
          </button>

          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1
            className={`text-4xl font-bold ${
              darkMode ? "text-gray-100" : "text-gray-900"
            } mb-2`}
          >
            Chat with PDF
          </h1>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Upload your document and start asking questions
          </p>
        </div>

        <FileUpload onUploadSuccess={() => setPdfUploaded(true)} darkMode={darkMode} />

        {pdfUploaded && <ChatBox darkMode={darkMode} />}
      </div>
    </div>
  );
}

export default App;
