import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./styles.css";

// MovieCard component
const MovieCard = ({ movie, onToggleFavorite, isFav }) => {
  const location = useLocation();

  return (
    <article className="movie-card" data-testid="movie-card">
      <Link
        to={`/movie/${movie.id}`}
        state={{ from: location.pathname + location.search }}
        aria-label={`Open ${movie.title}`}
        className="poster-link"
      >
        <img src={movie.poster} alt={movie.title} className="poster" />
      </Link>
      <div className="movie-body">
        <h3 className="movie-title">
          {movie.title && movie.title.length > 20
            ? movie.title.slice(0, 20) + "..."
            : movie.title}
        </h3>
        <p className="movie-meta">Year: {movie.year}</p>
        <p className="movie-meta">Rating: ⭐ {movie.rating.toFixed(1)}</p>

        {movie.genre && movie.genre.length > 10 ? (
          <p className="movie-meta">
            Genre: {movie.genre.slice(0, 10).join(", ")}...
          </p>
        ) : (
          <p className="movie-meta">Genre: {movie.genre.join(", ")}</p>
        )}

        {movie.overview && movie.overview.length > 100 ? (
          <p className="movie-overview">{movie.overview.slice(0, 100)}...</p>
        ) : (
          <p className="movie-overview">{movie.overview}</p>
        )}
        <div className="card-actions">
          <Link
            to={`/movie/${movie.id}`}
            className="details-link"
            aria-label={`Open ${movie.title}`}
          >
            Details
          </Link>

          <button
            className={
              isFav ? "favourite-added-button" : "favourite-add-button"
            }
            onClick={() => onToggleFavorite(movie)}
          >
            {isFav ? "Remove Favorite" : "Add Favorite"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
