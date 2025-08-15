import React, { useMemo, useState, useEffect, useCallback } from "react";
import "./styles.css";
import { Helmet } from "react-helmet-async";
import { Container } from "react-bootstrap";
import MovieCard from "../../components/MovieCard/MovieCard";
import Paginator from "../../components/Paginator/Paginator";
import Loader from "../../components/Loader/Loader";
import {
  getPopularMovies,
  getGeneres,
  discoverByGenre,
  img,
} from "../../api/tmdb";

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [selected, setSelected] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // favorites (store app-shaped movies)
  const [favorites, setFavorites] = useState(() =>
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );
  useEffect(
    () => localStorage.setItem("favorites", JSON.stringify(favorites)),
    [favorites]
  );

  const inFavById = useCallback(
    (id) => favorites.some((f) => f.id === String(id)),
    [favorites]
  );

  // NOTE: takes an app-shaped movie object and stores it as-is
  const toggleFavorite = (appMovie) => {
    setFavorites((prev) =>
      inFavById(appMovie.id)
        ? prev.filter((f) => f.id !== appMovie.id)
        : [...prev, appMovie]
    );
  };

  // fetch genre list once
  useEffect(() => {
    (async () => {
      try {
        const g = await getGeneres();
        setGenres(g.genres || []);
      } catch (e) {
        setErr("Failed to load genres");
      }
    })();
  }, []);

  // reset page on genre change
  useEffect(() => {
    setPage(1);
  }, [selected]);

  // fetch movies (All => Popular; otherwise discover by genre)
  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const data =
          selected === "All"
            ? await getPopularMovies(page)
            : await discoverByGenre(selected, page);
        setItems(data.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 500));
      } catch (e) {
        setErr("Failed to load movies");
      } finally {
        setLoading(false);
      }
    })();
  }, [selected, page]);

  const allGenres = useMemo(
    () => ["All", ...genres.map((g) => String(g.id))],
    [genres]
  );
  const nameFor = (id) =>
    id === "All"
      ? "All"
      : genres.find((g) => g.id === Number(id))?.name || "Genre";

  const isAll = selected === "All";
  const titleText = isAll
    ? `Popular Movies${page > 1 ? ` - Page ${page}` : ""} - MovieFinder`
    : `Genre: ${nameFor(selected)}${
        page > 1 ? ` - Page ${page}` : ""
      } - MovieFinder`;
  const descText = isAll
    ? "Browse popular movies. Save favorites and enjoy later."
    : `Browse ${nameFor(
        selected
      )} movies. Save favorites and export your list.`;

  return (
    <>
      <Helmet>
        <title>{titleText}</title>
        <meta name="description" content={descText} />
      </Helmet>

      <section className="genres">
        <div className="hero_bg" aria-hidden="true" />
        <Container>
          <div className="genres_header">
            <h1>
              {selected === "All"
                ? "Popular Movies"
                : `Genre: ${nameFor(selected)}`}
            </h1>

            <div className="toolbar">
              <label htmlFor="genre" className="sr-only">
                Genre
              </label>
              <select
                id="genre"
                className="input select"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                aria-label="Select a genre"
              >
                {allGenres.map((id) => (
                  <option key={id} value={id}>
                    {nameFor(id)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {err && <p className="muted">{err}</p>}
          {loading && <Loader />}

          <div className="genres-list">
            {!loading &&
              items.map((m) => {
                // map TMDB -> app shape ONCE per item
                const appMovie = {
                  id: String(m.id),
                  title: m.title,
                  year: (m.release_date || "").slice(0, 4),
                  genre: (m.genre_ids || [])
                    .map((id) => genres.find((g) => g.id === id)?.name)
                    .filter(Boolean)
                    .slice(0, 2),
                  rating: m.vote_average,
                  poster: img(m.poster_path, "w342"),
                  overview: m.overview || "",
                };

                return (
                  <MovieCard
                    key={appMovie.id}
                    movie={appMovie}
                    isFav={inFavById(appMovie.id)}
                    onToggleFavorite={() => toggleFavorite(appMovie)}
                  />
                );
              })}
          </div>

          {totalPages > 1 && (
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
          )}
        </Container>
      </section>
    </>
  );
};

export default Genres;
