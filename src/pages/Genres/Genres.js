
import React, { useMemo, useState } from 'react';
import moviesData from '../../data/movies.json';
import MovieCard from '../../components/MovieCard/MovieCard';
import './styles.css';

const allGenres = Array.from(new Set(moviesData.flatMap(m => m.genre))).sort();

const Genres = () => {
  const [selected, setSelected] = useState('All');
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites') || '[]'));
  const inFav = (m) => favorites.some(f => f.id === m.id);
  const toggleFavorite = (movie) => {
    const next = inFav(movie) ? favorites.filter(f => f.id !== movie.id) : [...favorites, movie];
    setFavorites(next);
    localStorage.setItem('favorites', JSON.stringify(next));
  };

  const list = useMemo(() => {
    if (selected === 'All') return moviesData;
    return moviesData.filter(m => m.genre.includes(selected));
  }, [selected]);

  return (
    <section>
      <h1>Browse by Genre</h1>
      <div className="toolbar">
        <label htmlFor="genre">Genre</label>
        <select id="genre" className="input" value={selected} onChange={(e)=>setSelected(e.target.value)}>
          <option>All</option>
          {allGenres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div className="grid">
        {list.map(m => (
          <MovieCard key={m.id} movie={m} onToggleFavorite={toggleFavorite} isFav={inFav(m)} />
        ))}
      </div>
    </section>
  );
};

export default Genres;
