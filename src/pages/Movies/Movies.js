import React, { useEffect, useMemo, useState } from "react";
import "./styles.css";
import {
  getPopularMovies,
  searchMovies,
  getGeneres,
  img,
} from "../../api/tmdb";
import MovieCard from "../../components/MovieCard/MovieCard";
import Paginator from "../../components/Paginator/Paginator";
import { Container } from "react-bootstrap";
import Loader from "../../components/Loader/Loader";

const Movies = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [generesById, setGeneresById] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const g = await getGeneres();
        const map = {};
        g.genres.forEach(({ id, name }) => (map[id] = name));
        setGeneresById(map);
      } catch (e) {
        console.error("Failed to fetch genres:", e);
        setErr("Failed to load genres");
      }
    })();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    let ignore = false;
    const run = async () => {
      setLoading(true);
      setErr("");
      try {
        const trimmed = query.trim();
        const data =
          trimmed.length >= 2
            ? await searchMovies(trimmed, page)
            : await getPopularMovies(page);

        if (ignore) return;
        setItems(data.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 500));
      } catch (e) {
        if (ignore) return;
        setErr("Failed to load movies");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    run();
    return () => {
      ignore = true;
    };
  }, [query, page]);

  const [favorites, setFavorites] = useState(() =>
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );
  useEffect(
    () => localStorage.setItem("favorites", JSON.stringify(favorites)),
    [favorites]
  );

  const inFav = (m) => favorites.some((f) => f.id === String(m.id));
  const toggleFavorite = (m) => {
    setFavorites((prev) =>
      inFav(m) ? prev.filter((f) => f.id !== String(m.id)) : [...prev, m]
    );
  };

  const display = useMemo(() => items, [items]);

  // NEW: handy trimmed query
  const trimmed = query.trim();

  return (
    <section className="movies">
      <div className="hero_bg" aria-hidden="true" />
      <Container>
        <div className="movies_header">
          <h1>{trimmed ? "Search Results" : "Popular Movies"}</h1>

          <div className="toolbar">
            <input
              aria-label="Search movies"
              className="input"
              placeholder="Search movies…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {err && <p className="muted">{err}</p>}
        {loading && <Loader />}

        {!loading && !err && trimmed.length >= 2 && display.length === 0 && (
          <div className="empty-state" role="status" aria-live="polite">
            <h2>No results for “{trimmed}”</h2>
            <p className="muted">
              Try a different title or check the spelling.
            </p>
            <button className="btn btn-outline" onClick={() => setQuery("")}>
              Clear search
            </button>
          </div>
        )}

        {/* Movies grid */}
        {!loading && !(trimmed.length >= 2 && display.length === 0) && (
          <div className="movies-list">
            {display.map((m) => (
              <MovieCard
                key={m.id}
                movie={toAppMovie(m, generesById)}
                onToggleFavorite={toggleFavorite}
                isFav={inFav(m)}
              />
            ))}
          </div>
        )}

        <div className="pagination">
          <Paginator
            page={page}
            totalPages={totalPages}
            onChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={loading}
          />
        </div>
      </Container>
    </section>
  );
};

export default Movies;

function toAppMovie(m, genresById) {
  return {
    id: String(m.id),
    title: m.title,
    year: (m.release_date || "").slice(0, 4),
    genre: (m.genre_ids || [])
      .map((id) => genresById[id])
      .filter(Boolean)
      .slice(0, 2),
    rating: m.vote_average,
    poster: img(m.poster_path, "w342"),
    overview: m.overview || "",
  };
}
