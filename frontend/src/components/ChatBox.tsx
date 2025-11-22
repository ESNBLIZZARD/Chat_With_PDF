import React, { useState } from "react";
import { askQuestion } from "../api";
import { Bot, Send, User } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface ChatProps {
  darkMode: boolean;
}

const ChatBox: React.FC<ChatProps> = ({ darkMode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);

    const question = input;
    setInput("");
    setLoading(true);

    try {
      const res = await askQuestion(question);

      const botMsg: Message = {
        sender: "bot",
        text: res.data.answer || "No answer found",
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [...prev, { sender: "bot", text: "Error fetching answer" }]);
    }

    setLoading(false);
  };

  return (
    <div
      className={`
    rounded-2xl shadow-xl border overflow-hidden 
    flex flex-col max-w-3xl mx-auto 
    h-[600px]     
    ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
  `}
    >
      {/* HEADER */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 p-5 flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Chat with your PDF</h3>
          <p className="text-blue-100 text-sm">Ask anything from the uploaded document</p>
        </div>
      </div>

      {/* MESSAGES */}
      <div
        className={`
    flex-1          /* let this fill the remaining height */
    overflow-y-auto  /* always scroll */
    p-6 space-y-5
    ${darkMode ? "bg-gray-900" : "bg-gray-50"}
  `}
      >
        {messages.length === 0 && !loading && (
          <div className={`flex flex-col justify-center items-center h-full ${darkMode ? "text-gray-500" : "text-gray-500"
            }`}>
            <Bot className="w-14 h-14 mb-3 opacity-50" />
            <p className="font-medium text-lg">Start asking questions</p>
            <p className="text-sm">Type below to begin</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
            <div
              className={`w-9 h-9 flex items-center justify-center rounded-full ${msg.sender === "user"
                ? "bg-blue-600"
                : darkMode
                  ? "bg-gray-700"
                  : "bg-gray-700"
                }`}
            >
              {msg.sender === "user" ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
            </div>

            <div
              className={`max-w-[70%] px-4 py-3 text-sm rounded-2xl leading-relaxed ${msg.sender === "user"
                ? "bg-blue-600 text-white rounded-tr-none"
                : darkMode
                  ? "bg-gray-800 text-gray-100 border border-gray-700 rounded-tl-none"
                  : "bg-white text-gray-800 border shadow rounded-tl-none"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-700">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} px-4 py-3 rounded-2xl border shadow`}>
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div
        className={`p-4 border-t flex gap-3 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
      >
        <input
          className={`flex-1 px-4 py-3 rounded-xl outline-none border ${darkMode
            ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
            : "bg-white border-gray-300 text-gray-900"
            }`}
          placeholder="Ask something from the PDF..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl shadow-lg transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
