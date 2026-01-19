import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MyList() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

const fetchFavorites = async () => {
    try {
      const authResponse = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getUser' }),
      });
      const authData = await authResponse.json();
      const user = authData.user;
      
      if (user) {
        const favResponse = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'list',
            userId: user.id,
          }),
        });
        const favData = await favResponse.json();
        setFavorites(favData.favorites || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div style={{ color: "white", padding: "100px", textAlign: "center" }}>
        Cargando...
      </div>
    );

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Mi Lista</h1>

      {favorites.length === 0 ? (
        <div style={emptyStyle}>
          <p>No tienes películas guardadas.</p>
          <Link to="/" style={btnStyle}>
            Explorar películas
          </Link>
        </div>
      ) : (
        <div style={gridStyle}>
          {favorites.map((fav) => (
            <Link key={fav.id} to={`/movie/${fav.movie_id}`} style={cardStyle}>
              <img
                src={
                  fav.poster_path
                    ? `https://image.tmdb.org/t/p/w500${fav.poster_path}`
                    : "https://via.placeholder.com/500x750"
                }
                alt={fav.movie_title}
                style={imgStyle}
              />
              <p style={movieTitleStyle}>{fav.movie_title}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const containerStyle = {
  padding: "100px 4% 50px 4%",
  backgroundColor: "#141414",
  minHeight: "100vh",
  color: "white",
  width: "100%",
  boxSizing: "border-box",
};

const titleStyle = {
  fontSize: "2rem",
  marginBottom: "40px",
  fontWeight: "bold",
  textAlign: "left",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: "20px",
  width: "100%",
};

const cardStyle = {
  textDecoration: "none",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease",
};

const imgStyle = {
  width: "100%",
  borderRadius: "4px",
  aspectRatio: "2/3",
  objectFit: "cover",
};

const movieTitleStyle = {
  fontSize: "0.9rem",
  fontWeight: "600",
  color: "#e5e5e5",
  marginTop: "10px",
  textAlign: "center",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const emptyStyle = { textAlign: "center", marginTop: "100px", color: "#666" };
const btnStyle = {
  display: "inline-block",
  marginTop: "20px",
  padding: "10px 20px",
  backgroundColor: "#e50914",
  color: "white",
  textDecoration: "none",
  borderRadius: "4px",
  fontWeight: "bold",
};
