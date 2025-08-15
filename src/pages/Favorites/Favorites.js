import React, { useEffect, useState } from "react";
import "./styles.css";
import { Helmet } from "react-helmet-async";
import { Container } from "react-bootstrap";
import { img } from "../../api/tmdb";
import Button from "../../components/Button/Button";

function normalize(f) {
  // Make favorites robust to old/new shapes
  return {
    id: String(f.id),
    title: f.title || f.name || "",
    year: f.year || (f.release_date || "").slice(0, 4) || "",

    // keep genres if already names; if array of objects, map to names; else empty
    genre: Array.isArray(f.genre)
      ? f.genre
      : Array.isArray(f.genres)
      ? f.genres
          .map((g) => (typeof g === "string" ? g : g?.name))
          .filter(Boolean)
      : [],
    rating: f.rating ?? f.vote_average ?? "",

    // critical: fallback to TMDB poster URL if only poster_path exists
    poster: f.poster || img(f.poster_path, "w342"),
    overview: f.overview || "",
  };
}

const Favorites = () => {
  const [favorites, setFavorites] = useState(() => {
    const raw = JSON.parse(localStorage.getItem("favorites") || "[]");
    return raw.map(normalize);
  });

  // Keep storage updated in the normalized shape
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const remove = (id) =>
    setFavorites((prev) => prev.filter((f) => String(f.id) !== String(id)));

  return (
    <>
      <Helmet>
        <title>Your Favorites - MovieFinder</title>
        <meta
          name="description"
          content="Your saved movies that you've loved and enjoyed."
        />
      </Helmet>

      <section className="favorites">
        <div className="hero_bg" aria-hidden="true" />
        <Container>
          <div className="favorites_header">
            <h1>Your Favorites</h1>
          </div>

          {favorites.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⭐</div>
              <h2>No favorites yet</h2>
              <p>
                Browse through our collection of movies and add them to your
                favorites to get started.
              </p>
              <Button href="/movies" text={"Explore Movies"} />
            </div>
          ) : (
            <ul className="favorites-list">
              {favorites.map((f) => (
                <li key={f.id} className="fav-item">
                  <img src={f.poster} alt={f.title} className="fav-poster" />
                  <div className="fav-body">
                    <strong className="fav-title">{f.title}</strong>
                    <div className="fav-meta">
                      <p>Year: {f.year}</p>
                      <p>Genre: {f.genre.join(", ")}</p>
                      <p>Rating: ⭐{f.rating.toFixed(1)}</p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center align-items-center">
                    <button
                      className="remove-fav-button"
                      onClick={() => remove(f.id)}
                      aria-label={`Remove ${f.title} from favorites`}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
};

export default Favorites;
