import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GENRES = [
  { id: 28, name: "Acción" },
  { id: 12, name: "Aventura" },
  { id: 35, name: "Comedia" },
  { id: 80, name: "Crimen" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Terror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Ciencia Ficción" },
];

export default function Sidebar({ onSelectGenre, isMobileSidebarOpen, setIsMobileSidebarOpen }) {
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile && !isMobileSidebarOpen) return null;

  const handleGenreClick = (genreId) => {
    onSelectGenre(genreId);
    navigate("/");
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  const sidebarStyleMobile = isMobile ? {
    ...sidebarStyle,
    width: "280px",
    transform: isMobileSidebarOpen ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 0.3s ease",
    zIndex: 3000,
    boxShadow: "2px 0 10px rgba(0,0,0,0.5)"
  } : sidebarStyle;

  return (
    <>
      {isMobile && isMobileSidebarOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 2999,
            onClick: () => setIsMobileSidebarOpen(false)
          }}
        />
      )}
      <div style={sidebarStyleMobile}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
          <h3 style={titleStyle}>Explorar</h3>
          {isMobile && (
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "24px",
                cursor: "pointer",
                padding: "0"
              }}
            >
              ×
            </button>
          )}
        </div>

        <div style={searchSection}>
          <label style={labelStyle}>Buscar por género</label>
          <select
            onChange={(e) => handleGenreClick(e.target.value)}
            style={selectStyle}
          >
            <option value="">Todos los géneros</option>
            {GENRES.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <ul style={listStyle}>
          {GENRES.map((g) => (
            <li
              key={g.id}
              style={itemStyle}
              onClick={() => handleGenreClick(g.id)}
              onMouseOver={(e) => (e.target.style.color = "white")}
              onMouseOut={(e) => (e.target.style.color = "#aaa")}
            >
              {g.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const sidebarStyle = {
  width: "240px",
  backgroundColor: "#111",
  padding: "100px 20px 20px 20px",
  height: "100vh",
  position: "fixed",
  left: 0,
  top: 0,
  borderRight: "1px solid #333",
  overflowY: "auto",
};

const titleStyle = {
  color: "#e50914",
  fontSize: "1.2rem",
  marginBottom: "25px",
};
const searchSection = { marginBottom: "30px" };
const labelStyle = {
  color: "#888",
  display: "block",
  fontSize: "0.8rem",
  marginBottom: "8px",
};
const selectStyle = {
  width: "100%",
  backgroundColor: "#222",
  color: "white",
  border: "1px solid #444",
  padding: "8px",
  borderRadius: "4px",
  cursor: "pointer",
};
const listStyle = { listStyle: "none", padding: 0 };
const itemStyle = {
  color: "#aaa",
  padding: "10px 0",
  cursor: "pointer",
  transition: "0.3s",
  fontSize: "0.9rem",
  borderBottom: "1px solid #1a1a1a",
};
