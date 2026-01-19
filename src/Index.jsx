import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Search from "./Search";
import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";
import IntroSection from "./components/IntroSection";
import { useGenreContext } from "./App";
import "./index.css";

export default function Index() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("movie");
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const observerRef = useRef();
  
  const { selectedGenre, setSelectedGenre, genreQuery, setGenreQuery } = useGenreContext();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);



  const handleLogoClick = () => {
    setQuery("");
    setSelectedGenre("");
    setGenreQuery("");
    setType("movie");
    setPage(1);
  };

  useEffect(() => {
    setMovies([]);
    setPage(1);
  }, [query, type, selectedGenre, genreQuery]);

useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/browse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type,
            page,
            query: query || undefined,
            genre: selectedGenre || undefined,
          }),
        });
        const data = await response.json();
        setMovies((prev) =>
          page === 1 ? data.results || [] : [...prev, ...(data.results || [])]
        );
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchMovies();
  }, [query, type, page, selectedGenre, genreQuery]);

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

const askGlobalAI = async () => {
    if (!prompt.trim()) return;
    setIsTyping(true);
    const userMsg = { role: "user", text: prompt };
    const currentPrompt = prompt;
    setPrompt("");
    setChatHistory((prev) => [...prev, userMsg]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentPrompt,
          context: chatHistory.map((m) => m.text).join(' | '),
        }),
      });

      const data = await response.json();
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", text: data.response },
      ]);
    } catch (error) {
      console.error("Error en el chat:", error);
    } finally {
      setIsTyping(false);
    }
  };

return (
    <div className="index-container">
      {false && (
        <Sidebar
          onSelectGenre={(id) => {
            setQuery("");
            setSelectedGenre(id);
          }}
        />
      )}

      <h1
        className="index-title"
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
      >
        🎬 AI Movie & TV Explorer
      </h1>

      <IntroSection />

      <Search
        query={query}
        setQuery={(val) => {
          setQuery(val);
          setSelectedGenre("");
          setGenreQuery("");
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

        {!isMobile && <RightSidebar />}
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
