import React, { useState } from "react";
import { askQuestion } from "../api";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const question = input;
    setInput("");

    try {
      const res = await askQuestion(question);

      const botMsg: Message = {
        sender: "bot",
        text: res.data.answer || "No answer found",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error fetching answer" },
      ]);
    }
  };

  return (
    <>
      <div className="chat-container">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          placeholder="Ask something from the PDF..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </>
  );
};

export default ChatBox;
