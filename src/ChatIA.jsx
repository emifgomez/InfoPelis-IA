import { useState } from "react";

export default function ChatIA({ data, cast }) {
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  

  const askAI = async () => {
    if (!prompt.trim() || !data) return;
    setIsTyping(true);
    const userMessage = { role: "user", text: prompt };
    setChatHistory((prev) => [...prev, userMessage]);
    const currentPrompt = prompt;
    setPrompt("");

    const castNames = cast.map((a) => `${a.name} (${a.character})`).join(", ");

try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentPrompt,
          movieData: data,
          cast: cast,
        }),
      });

      const result = await response.json();
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", text: result.response },
      ]);
    } catch (error) {
      console.error("Error IA:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">
        <span>🤖</span> Pregúntale a la IA
      </h2>
      <div className="chat-box">
        {chatHistory.length === 0 && (
          <p className="empty-chat-text">
            ¿Tienes dudas sobre el final? ¡Pregunta aquí!
          </p>
        )}
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className="chat-msg"
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.role === "user" ? "#e50914" : "#333",
            }}
          >
            {msg.text}
          </div>
        ))}
        {isTyping && <div className="typing-text">Analizando datos...</div>}
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && askAI()}
          placeholder="¿Qué tal es la actuación?"
          className="input-ai"
        />
        <button onClick={askAI} disabled={isTyping} className="btn-primary">
          {isTyping ? "..." : "ENVIAR"}
        </button>
      </div>
    </div>
  );
}