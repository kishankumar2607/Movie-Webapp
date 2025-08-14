
import React, { useEffect, useMemo, useState } from 'react';
import moviesData from '../../data/movies.json';
import MovieCard from '../../components/MovieCard/MovieCard';
import './styles.css';

const Movies = () => {
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites') || '[]'));

  useEffect(() => localStorage.setItem('favorites', JSON.stringify(favorites)), [favorites]);

  const inFav = (m) => favorites.some(f => f.id === m.id);
  const toggleFavorite = (movie) => {
    setFavorites(prev => inFav(movie) ? prev.filter(f => f.id !== movie.id) : [...prev, movie]);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? moviesData.filter(m => (m.title.toLowerCase().includes(q) || String(m.year).includes(q))) : moviesData;
  }, [query]);

  return (
    <section>
      <h1>Popular Movies</h1>
      <div className="toolbar">
        <input
          aria-label="Search movies"
          className="input"
          placeholder="Search by title or year…"
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
        />
      </div>
      <div className="grid">
        {filtered.map(m => (
          <MovieCard key={m.id} movie={m} onToggleFavorite={toggleFavorite} isFav={inFav(m)} />
        ))}
      </div>
    </section>
  );
};

export default Movies;
