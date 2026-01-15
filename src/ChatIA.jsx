import { useState } from "react";

export default function ChatIA({ data, cast }) {
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const API_KEY_MISTRAL = import.meta.env.VITE_MISTRAL_KEY;

  const askAI = async () => {
    if (!prompt.trim() || !data) return;
    setIsTyping(true);
    const userMessage = { role: "user", text: prompt };
    setChatHistory((prev) => [...prev, userMessage]);
    const currentPrompt = prompt;
    setPrompt("");

    const castNames = cast.map((a) => `${a.name} (${a.character})`).join(", ");

    try {
      const response = await fetch(
        "https://api.mistral.ai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY_MISTRAL}`,
          },
          body: JSON.stringify({
            model: "mistral-small-latest",
            messages: [
              {
                role: "system",
                content: `Eres un experto cinéfilo hablando sobre "${
                  data.title || data.name
                }". Datos: Reparto: ${castNames}. Sinopsis: ${
                  data.overview
                }. Reglas: Sé breve, entusiasta y no inventes datos.`,
              },
              { role: "user", content: currentPrompt },
            ],
            temperature: 0.8,
          }),
        }
      );
      const result = await response.json();
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", text: result.choices[0].message.content },
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