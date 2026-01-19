import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ActorDetail() {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  

useEffect(() => {
    const fetchActorData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/actor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });

        const data = await response.json();
        setActor(data.actor);
        setMovies(data.movies);
        setLoading(false);
      } catch (err) {
        console.error("Error cargando datos del actor:", err);
        setLoading(false);
      }
    };

    fetchActorData();
  }, [id]);

  if (loading)
    return (
      <div style={{ color: "white", padding: "40px", textAlign: "center" }}>
        Cargando perfil...
      </div>
    );
  if (!actor)
    return (
      <div style={{ color: "white", padding: "40px" }}>
        No se encontró información del actor.
      </div>
    );

  return (
    <div style={pageStyle}>
      <button onClick={() => window.history.back()} style={backButtonStyle}>
        ← VOLVER
      </button>

      <div style={headerContainerStyle}>
        <img
          src={
            actor.profile_path
              ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
              : "https://via.placeholder.com/500x750?text=Sin+Foto"
          }
          alt={actor.name}
          style={profileImgStyle}
        />

        <div style={{ flex: 1, minWidth: "300px" }}>
          <h1 style={nameStyle}>{actor.name}</h1>

          <div style={infoRowStyle}>
            <span>🎂 {actor.birthday || "N/A"}</span>
            <span>📍 {actor.place_of_birth || "Desconocido"}</span>
          </div>

          <h3 style={sectionTitleStyle}>Biografía</h3>
          <p style={biographyStyle}>
            {actor.biography ||
              "No hay una biografía disponible en español para este actor."}
          </p>
        </div>
      </div>

      <div style={{ marginTop: "60px" }}>
        <h2 style={filmographyTitleStyle}>Películas Destacadas</h2>

        <div style={gridStyle}>
          {movies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              style={movieLinkStyle}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                      : "https://via.placeholder.com/180x270?text=Sin+Poster"
                  }
                  alt={movie.title}
                  style={posterImgStyle}
                />
                <div style={ratingBadgeStyle}>
                  ⭐ {movie.vote_average?.toFixed(1)}
                </div>
              </div>
              <p style={movieTitleStyle}>{movie.title}</p>
              <p style={characterNameStyle}>
                {movie.character
                  ? `como ${movie.character}`
                  : movie.release_date?.split("-")[0]}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  padding: "40px",
  color: "white",
  backgroundColor: "#141414",
  minHeight: "100vh",
  fontFamily: "sans-serif",
  width: "calc(100vw - 260px)",
  display: "block",
  boxSizing: "border-box",
  position: "relative"
};

const backButtonStyle = {
  backgroundColor: "transparent",
  border: "none",
  color: "#e50914",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "1rem",
  marginBottom: "30px",
};

const headerContainerStyle = {
  display: "flex",
  gap: "50px",
  flexWrap: "wrap",
  alignItems: "flex-start",
  width: "100%", 
  marginBottom: "50px"
};

const profileImgStyle = {
  width: "350px",
  borderRadius: "20px",
  boxShadow: "0 15px 35px rgba(0,0,0,0.7)",
};

const nameStyle = {
  fontSize: "4.5rem",
  margin: "0 0 15px 0",
  fontWeight: "800",
};

const infoRowStyle = {
  display: "flex",
  gap: "30px",
  color: "#aaa",
  marginBottom: "30px",
  fontSize: "1.1rem",
  justifyContent: "center", 
  width: "100%", 
};

const sectionTitleStyle = {
  borderBottom: "1px solid #333",
  paddingBottom: "10px",
  fontSize: "1.5rem",
  color: "#eee",
};

const biographyStyle = {
  lineHeight: "1.8",
  fontSize: "1.2rem",
  color: "#ccc",
  textAlign: "justify",
  maxWidth: "100%",
};

const filmographyTitleStyle = {
  fontSize: "2.2rem",
  marginBottom: "40px",
  borderLeft: "6px solid #e50914",
  paddingLeft: "20px",
};

const gridStyle = { 
  display: "grid", 
  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", 
  gap: "25px",
  width: "100%",
  marginTop: "20px"
};

const movieLinkStyle = {
  textDecoration: "none",
  color: "white",
  transition: "transform 0.3s ease",
  display: "block",
};

const posterImgStyle = {
  width: "100%",
  borderRadius: "15px",
  display: "block",
  boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
};

const ratingBadgeStyle = {
  position: "absolute",
  top: "12px",
  right: "12px",
  backgroundColor: "rgba(0,0,0,0.8)",
  padding: "6px 10px",
  borderRadius: "8px",
  fontSize: "0.85rem",
  color: "#ffcc00",
  fontWeight: "bold",
  backdropFilter: "blur(4px)",
};

const movieTitleStyle = {
  marginTop: "15px",
  fontSize: "1rem",
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: "5px",
};

const characterNameStyle = {
  fontSize: "0.85rem",
  color: "#888",
  textAlign: "center",
  margin: "0",
};
