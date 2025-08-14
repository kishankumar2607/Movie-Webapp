
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites') || '[]'));

  useEffect(()=>localStorage.setItem('favorites', JSON.stringify(favorites)), [favorites]);

  const remove = (id) => setFavorites(prev => prev.filter(f => f.id !== id));

  const downloadFavorites = () => {
    const blob = new Blob([JSON.stringify(favorites, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'favorites.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section>
      <h1>Your Favorites</h1>
      {favorites.length === 0 ? (
        <p className="muted">No favorites yet. Go to <Link to="/movies">Popular</Link> and add some!</p>
      ) : (
        <>
          <div className="toolbar">
            <button className="btn" onClick={downloadFavorites}>Download Favorites (.json)</button>
          </div>
          <ul className="fav-list">
            {favorites.map(f => (
              <li key={f.id} className="fav-item">
                <img src={f.poster} alt={f.title} />
                <div>
                  <strong>{f.title}</strong>
                  <div className="muted">{f.year} • {f.genre.join(', ')} • ⭐ {f.rating}</div>
                </div>
                <button className="btn btn-small btn-alt" onClick={()=>remove(f.id)}>Remove</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};

export default Favorites;
