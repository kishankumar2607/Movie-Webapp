
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import movies from '../../data/movies.json';
import './styles.css';

const MovieDetails = () => {
  const { id } = useParams();
  const m = movies.find(x => x.id === id);
  if (!m) return (<section><h1>Movie not found</h1><Link to="/movies" className="btn btn-small">Back</Link></section>);
  return (
    <section className="details">
      <div className="details-grid">
        <img src={m.poster} alt={m.title} className="poster-lg" />
        <div>
          <h1>{m.title}</h1>
          <p className="muted">{m.year} • {m.genre.join(', ')} • ⭐ {m.rating}</p>
          <p>{m.overview}</p>
          <div className="toolbar">
            <Link to="/movies" className="btn btn-small">Back to Popular</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieDetails;
