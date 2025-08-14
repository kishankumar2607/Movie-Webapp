
import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const MovieCard = ({ movie, onToggleFavorite, isFav }) => {
  return (
    <article className="movie-card" data-testid="movie-card">
      <img src={movie.poster} alt={movie.title} className="poster" />
      <div className="movie-body">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-meta">{movie.year} • {movie.genre.join(', ')} • ⭐ {movie.rating}</p>
        <p className="movie-overview">{movie.overview}</p>
        <div className="card-actions">
          <Link to={`/movie/${movie.id}`} className="btn btn-small" aria-label={`Open ${movie.title}`}>Details</Link>
          <button className={isFav ? 'btn btn-small btn-alt' : 'btn btn-small'} onClick={() => onToggleFavorite(movie)}>
            {isFav ? 'Remove Favorite' : 'Add Favorite'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
