import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function RightSidebar() {
  const [trending, setTrending] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingResponse, authResponse, reviewsResponse] = await Promise.all([
          fetch('/api/trending', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          }),
          fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'getUser' }),
          }),
          fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ limit: 4 }),
          }),
        ]);

        const trendingData = await trendingResponse.json();
        setTrending(trendingData.results || []);

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
          setFavorites(favData.favorites?.slice(0, 5) || []);
        }

        const reviewsData = await reviewsResponse.json();
        setRecentReviews(reviewsData.reviews || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <aside className="right-sidebar">
      <section className="sidebar-section">
        <h3>🔥 Tendencias</h3>
        <div className="sidebar-list">
          {trending.map((item) => (
            <Link
              key={item.id}
              to={`/show/${item.media_type || "movie"}/${item.id}`}
              className="sidebar-item"
            >
              <img
                src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                alt={item.title}
                className="sidebar-img"
              />
              <div className="sidebar-info">
                <p className="sidebar-item-title">{item.title || item.name}</p>
                <span className="sidebar-item-sub">
                  ⭐ {item.vote_average?.toFixed(1)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="sidebar-section">
        <h3>⭐ Mi Lista</h3>
        <div className="sidebar-list">
          {favorites.length > 0 ? (
            favorites.map((fav) => (
              <Link
                key={fav.id}
                to={`/show/movie/${fav.movie_id}`}
                className="sidebar-item mini"
              >
                <p className="sidebar-item-title">
                  📌{" "}
                  {fav.movie_title || fav.title || `Peli ID: ${fav.movie_id}`}
                </p>
              </Link>
            ))
          ) : (
            <p className="empty-text">No tienes favoritos aún.</p>
          )}
        </div>
      </section>

      <section className="sidebar-section">
        <h3>💬 Comunidad</h3>
        <div className="sidebar-list">
          {recentReviews.length > 0 ? (
            recentReviews.map((rev) => (
              <div key={rev.id} className="sidebar-review-card">
                <p className="review-author">
                  👤 {rev.user_email?.split("@")[0] || "Cinéfilo"}
                </p>
                <p className="review-snippet">
                  "{rev.content?.substring(0, 50)}..."
                </p>
                <Link
                  to={`/show/movie/${rev.movie_id}`}
                  className="review-movie-tag"
                >
                  en: <strong>{rev.movie_title || "Ver película"}</strong>
                </Link>
              </div>
            ))
          ) : (
            <p className="empty-text">Sin comentarios recientes.</p>
          )}
        </div>
      </section>
    </aside>
  );
}
