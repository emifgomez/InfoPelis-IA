import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ChatIA from "./ChatIA";
import Reviews from "./Reviews";
import "./Show.css";

export default function Show() {
  const { type, id } = useParams();
  const [data, setData] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  

useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const [authResponse, movieResponse] = await Promise.all([
          fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'getUser' }),
          }),
          fetch('/api/movie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, id }),
          }),
        ]);

        const authData = await authResponse.json();
        setCurrentUser(authData.user);

        const movieData = await movieResponse.json();
        const res = movieData.data;
        setData(res);
        setCast(res.credits?.cast?.slice(0, 10) || []);
        const videoData = res.videos?.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (videoData) setTrailer(videoData.key);
        checkIfFavorite(res.id);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMovieData();
  }, [id, type]);

const checkIfFavorite = async (movieId) => {
    try {
      const authResponse = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getUser' }),
      });
      const authData = await authResponse.json();
      const user = authData.user;
      
      if (!user) return;
      
      const favResponse = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check',
          movieId: movieId.toString(),
          userId: user.id,
        }),
      });
      
      const favData = await favResponse.json();
      if (favData.isFavorite) setIsFavorite(true);
    } catch (error) {
      console.error("Error checking favorite:", error);
    }
  };

const toggleFavorite = async () => {
    setLoadingFav(true);
    try {
      const authResponse = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getUser' }),
      });
      const authData = await authResponse.json();
      const user = authData.user;
      
      if (!user) {
        alert("Debes estar logueado para guardar favoritos");
        setLoadingFav(false);
        return;
      }

      const favResponse = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle',
          movieId: data.id.toString(),
          movieTitle: data.title || data.name,
          posterPath: data.poster_path,
          userId: user.id,
        }),
      });

      const favData = await favResponse.json();
      setIsFavorite(favData.isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setLoadingFav(false);
    }
  };

  if (!data)
    return <div style={{ color: "white", padding: "20px" }}>Cargando...</div>;

  return (
    <div className="show-page">
      <Link to="/" className="back-link">
        ← VOLVER
      </Link>

      <div className="main-section">
        <img
          src={
            data.poster_path
              ? `https://image.tmdb.org/t/p/w400${data.poster_path}`
              : "https://via.placeholder.com/400x600"
          }
          alt={data.title || data.name}
          className="poster-img"
        />

        <div style={{ flex: 1, minWidth: "300px" }}>
          <div className="header-action">
            <h1 className="show-title">{data.title || data.name}</h1>
            <button
              onClick={toggleFavorite}
              disabled={loadingFav}
              className="fav-btn"
              style={{
                color: isFavorite ? "#e50914" : "#fff",
                borderColor: isFavorite ? "#e50914" : "#444",
              }}
            >
              {isFavorite ? "❤️ En mi lista" : "🤍 Guardar"}
            </button>
          </div>

          <p className="show-subtitle">
            {data.release_date || data.first_air_date} •{" "}
            {data.genres?.map((g) => g.name).join(", ")}
          </p>

          <h3 className="section-title">Sinopsis</h3>
          <p className="show-overview">
            {data.overview || "No hay sinopsis disponible."}
          </p>

          {trailer && (
            <>
              <h3 className="section-title">Trailer Oficial</h3>
              <div className="trailer-wrapper">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${trailer}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </>
          )}

          <h3 className="section-title">Reparto Principal</h3>
          <div className="cast-scroll">
            {cast.map((actor) => (
              <Link
                key={actor.id}
                to={`/actor/${actor.id}`}
                className="actor-card"
              >
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : "https://via.placeholder.com/110x160"
                  }
                  alt={actor.name}
                  className="actor-img"
                />
                <p className="actor-name">{actor.name}</p>
                <p className="actor-char">{actor.character}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Reviews id={id} data={data} currentUser={currentUser} />

      <ChatIA data={data} cast={cast} />
    </div>
  );
}
