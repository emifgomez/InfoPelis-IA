import { useEffect, useState } from "react";

export default function Reviews({ id, data, currentUser }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [allReviews, setAllReviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [id]);

const fetchReviews = async () => {
    try {
      const response = await fetch('/api/movie-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: id,
          action: 'list',
        }),
      });
      const data = await response.json();
      if (data.reviews) setAllReviews(data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

const submitReview = async () => {
    try {
      const authResponse = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getUser' }),
      });
      const authData = await authResponse.json();
      const user = authData.user;
      
      if (!user) return alert("Debes iniciar sesión para dejar una reseña");
      if (rating === 0) return alert("Por favor, selecciona una puntuación");
      if (!reviewText.trim()) return alert("El comentario no puede estar vacío");

      setIsSubmitting(true);
      
      const response = await fetch('/api/movie-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: id,
          action: 'create',
          reviewData: {
            user_id: user.id,
            user_email: user.email,
            rating,
            content: reviewText,
            movie_title: data.title || data.name,
          },
        }),
      });

      if (response.ok) {
        setReviewText("");
        setRating(0);
        fetchReviews();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

const deleteReview = async (reviewId) => {
    if (!window.confirm("¿Estás seguro de que quieres borrar tu reseña?"))
      return;
    
    try {
      const response = await fetch('/api/movie-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: id,
          action: 'delete',
          reviewId,
        }),
      });

      if (response.ok) {
        setAllReviews((prev) => prev.filter((r) => r.id !== reviewId));
      } else {
        alert("No se pudo eliminar la reseña");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("No se pudo eliminar la reseña");
    }
  };

  return (
    <div className="review-section-container">
      <h2 className="section-title">Reseñas de la Comunidad</h2>

      <div className="review-form-card">
        <h4>¿Qué te pareció esta obra?</h4>
        <div style={{ marginBottom: "15px" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="star-button"
              style={{
                color: star <= (hover || rating) ? "#ffcc00" : "#444",
              }}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Escribe tu opinión aquí..."
          className="review-textarea"
        />
        <button
          onClick={submitReview}
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? "PUBLICANDO..." : "PUBLICAR RESEÑA"}
        </button>
      </div>

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {allReviews.length === 0 ? (
          <p style={{ color: "#666", textAlign: "center" }}>
            No hay reseñas aún.
          </p>
        ) : (
          allReviews.map((rev) => (
            <div key={rev.id} className="review-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span style={{ color: "#e50914", fontWeight: "bold" }}>
                    {rev.user_email?.split("@")[0]}
                  </span>
                  <span style={{ color: "#ffcc00", fontSize: "1.1rem" }}>
                    {"★".repeat(rev.rating)}
                    {"☆".repeat(5 - rev.rating)}
                  </span>
                </div>
                {currentUser && currentUser.id === rev.user_id && (
                  <button
                    onClick={() => deleteReview(rev.id)}
                    className="delete-review-btn"
                    title="Eliminar reseña"
                  >
                    🗑️
                  </button>
                )}
              </div>
              <p
                style={{
                  margin: "10px 0 0",
                  color: "#ccc",
                  lineHeight: "1.5",
                }}
              >
                {rev.content}
              </p>
              <small
                style={{
                  color: "#555",
                  fontSize: "0.7rem",
                  marginTop: "10px",
                  display: "block",
                }}
              >
                {new Date(rev.created_at).toLocaleDateString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}