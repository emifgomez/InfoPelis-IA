import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "./supabaseClient";
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

  const API_KEY_TMDB = import.meta.env.VITE_TMDB_KEY;

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });

    const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY_TMDB}&language=es-ES&append_to_response=credits,videos`;
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setCast(res.credits?.cast?.slice(0, 10) || []);
        const videoData = res.videos?.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (videoData) setTrailer(videoData.key);
        checkIfFavorite(res.id);
      })
      .catch((err) => console.error(err));
  }, [id, type, API_KEY_TMDB]);

  const checkIfFavorite = async (movieId) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data: fav } = await supabase
      .from("favoritos")
      .select("*")
      .eq("user_id", user.id)
      .eq("movie_id", movieId.toString())
      .single();
    if (fav) setIsFavorite(true);
  };

  const toggleFavorite = async () => {
    setLoadingFav(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Debes estar logueado para guardar favoritos");
      setLoadingFav(false);
      return;
    }
    if (isFavorite) {
      await supabase
        .from("favoritos")
        .delete()
        .eq("user_id", user.id)
        .eq("movie_id", data.id.toString());
      setIsFavorite(false);
    } else {
      await supabase.from("favoritos").insert([
        {
          user_id: user.id,
          movie_id: data.id.toString(),
          movie_title: data.title || data.name,
          poster_path: data.poster_path,
        },
      ]);
      setIsFavorite(true);
    }
    setLoadingFav(false);
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
