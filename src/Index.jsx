import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Search from "./Search";
import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";
import "./Index.css";

export default function Index() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("movie");
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState("");
  const observerRef = useRef();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const API_KEY = import.meta.env.VITE_TMDB_KEY;
  const API_KEY_MISTRAL = import.meta.env.VITE_MISTRAL_KEY;

  const handleLogoClick = () => {
    setQuery("");
    setSelectedGenre("");
    setType("movie");
    setPage(1);
  };

  useEffect(() => {
    setMovies([]);
    setPage(1);
  }, [query, type, selectedGenre]);

  useEffect(() => {
    let url = "";
    if (query) {
      url = `https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&language=es-ES&query=${query}&page=${page}`;
    } else if (selectedGenre) {
      url = `https://api.themoviedb.org/3/discover/${type}?api_key=${API_KEY}&language=es-ES&with_genres=${selectedGenre}&page=${page}&sort_by=popularity.desc`;
    } else {
      const endpoint = type === "movie" ? "movie" : "tv";
      url = `https://api.themoviedb.org/3/${endpoint}/popular?api_key=${API_KEY}&language=es-ES&page=${page}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setMovies((prev) =>
          page === 1 ? data.results || [] : [...prev, ...(data.results || [])]
        );
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [query, type, page, selectedGenre, API_KEY]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [movies]);

  const askGlobalAI = async () => {
    if (!prompt.trim()) return;
    setIsTyping(true);
    const userMsg = { role: "user", text: prompt };
    const currentPrompt = prompt;
    setPrompt("");
    setChatHistory((prev) => [...prev, userMsg]);

    try {
      const searchRes = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=es-ES&query=${currentPrompt}`
      );
      const searchData = await searchRes.json();
      const contextInfo = searchData.results
        ?.slice(0, 2)
        .map((r) => `Obra: ${r.title || r.name}. Sinopsis: ${r.overview}.`)
        .join(" | ");

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
                content: `Sos un cinéfilo experto hablando con un amigo. Contexto: ${
                  contextInfo || "No hay info extra"
                }. REGLAS: Responde informal, breve y no inventes.`,
              },
              ...chatHistory.map((m) => ({
                role: m.role === "user" ? "user" : "assistant",
                content: m.text,
              })),
              { role: "user", content: currentPrompt },
            ],
            temperature: 0.8,
          }),
        }
      );

      const dataMistral = await response.json();
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", text: dataMistral.choices[0].message.content },
      ]);
    } catch (error) {
      console.error("Error en el chat:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="index-container">
      <Sidebar
        onSelectGenre={(id) => {
          setQuery("");
          setSelectedGenre(id);
        }}
      />

      <h1
        className="index-title"
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
      >
        🎬 AI Movie & TV Explorer
      </h1>

      <Search
        query={query}
        setQuery={(val) => {
          setQuery(val);
          setSelectedGenre("");
        }}
        type={type}
        setType={setType}
      />

      <div className="index-layout">
        <main className="main-content">
          <div className="movies-grid">
            {movies.map((item, index) => (
              <Link
                key={`${item.id}-${index}`}
                to={`/show/${type}/${item.id}`}
                className="movie-card-link"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="movie-card">
                  <img
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                        : "https://via.placeholder.com/300x450"
                    }
                    alt={item.title || item.name}
                  />
                  <div className="movie-info">
                    <h3>{item.title || item.name}</h3>
                    <span className="movie-rating">
                      ★ {item.vote_average?.toFixed(1)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div ref={observerRef} className="scroll-sentinel" />
        </main>

        <RightSidebar />
      </div>

      <div className="floating-chat-container">
        {isChatOpen ? (
          <div className="chat-window">
            <div className="chat-header">
              <span>🍿 Asistente Cinéfilo</span>
              <button
                onClick={() => setIsChatOpen(false)}
                className="close-chat-btn"
              >
                ×
              </button>
            </div>
            <div className="chat-messages">
              {chatHistory.map((m, i) => (
                <div
                  key={i}
                  className="chat-bubble"
                  style={{
                    alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                    backgroundColor: m.role === "user" ? "#e50914" : "#333",
                  }}
                >
                  {m.text}
                </div>
              ))}
              {isTyping && (
                <div style={{ fontSize: "0.8rem", color: "#aaa" }}>
                  Pensando...
                </div>
              )}
            </div>
            <div className="chat-input-area">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && askGlobalAI()}
                placeholder="Preguntale lo que quieras..."
              />
              <button onClick={askGlobalAI} className="chat-send-btn">
                ➤
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsChatOpen(true)}
            className="chat-toggle-btn"
          >
            🤖
          </button>
        )}
      </div>
    </div>
  );
}
