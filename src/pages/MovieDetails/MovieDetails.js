import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Modal } from "react-bootstrap";
import "./styles.css";
import { getMovie, getMovieVideos, img } from "../../api/tmdb";
import Loader from "../../components/Loader/Loader";

const mapToApp = (m) => ({
  id: String(m.id),
  title: m.title,
  year: (m.release_date || "").slice(0, 4),
  genre: (m.genres || [])
    .map((g) => g.name)
    .filter(Boolean)
    .slice(0, 3),
  rating: m.vote_average,
  poster: img(m.poster_path, "w500"),
  backdrop: img(m.backdrop_path, "w1280"),
  overview: m.overview || "",
  runtime: m.runtime,
  tagline: m.tagline,
  release_date: m.release_date,
  status: m.status,
  spoken_languages: m.spoken_languages || [],
});

const MovieDetails = () => {
  const { id } = useParams();
  const [movieRaw, setMovieRaw] = useState(null);
  const [ytKey, setYtKey] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // favorites
  const [favorites, setFavorites] = useState(() =>
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );
  useEffect(
    () => localStorage.setItem("favorites", JSON.stringify(favorites)),
    [favorites]
  );
  const inFav = (m) => favorites.some((f) => f.id === String(m.id));
  const toggleFavorite = (appMovie) => {
    setFavorites((prev) =>
      inFav(appMovie)
        ? prev.filter((f) => f.id !== appMovie.id)
        : [...prev, appMovie]
    );
  };

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const data = await getMovie(id);
        if (!ignore) setMovieRaw(data);

        // fetch trailer key
        try {
          const vids = await getMovieVideos(id);
          const yt = (vids.results || []).find(
            (v) =>
              v.site === "YouTube" &&
              (v.type === "Trailer" || v.type === "Teaser")
          );
          if (!ignore && yt?.key) setYtKey(yt.key);
        } catch {
          /* non-fatal */
        }
      } catch (e) {
        if (!ignore) setErr("Failed to load movie");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading)
    return (
      <section className="details">
        <Container>
          <Loader />
        </Container>
      </section>
    );
  if (err)
    return (
      <section className="details">
        <Container>
          <p className="muted">{err}</p>
        </Container>
      </section>
    );
  if (!movieRaw)
    return (
      <section className="details">
        <Container>
          <h1>Movie not found</h1>
          <Link to="/movies" className="btn btn-small">
            Back
          </Link>
        </Container>
      </section>
    );

  const movie = mapToApp(movieRaw);

  return (
    <section className="details">
      {/* Accent + soft image backdrop */}
      <div className="hero_bg" aria-hidden="true" />
      {movieRaw.backdrop_path && (
        <div className="details_backdrop" aria-hidden="true">
          <img src={movie.backdrop} alt="" className="details_backdrop-img" />
        </div>
      )}

      <Container>
        <div className="details_panel">
          <div className="details_poster">
            <img src={movie.poster} alt={movie.title} className="poster-lg" />
            {ytKey && (
              <button
                type="button"
                className="poster-play"
                aria-label="Play trailer"
                onClick={() => setShowTrailer(true)}
              >
                <svg viewBox="0 0 64 64" aria-hidden="true">
                  <circle cx="32" cy="32" r="31" className="ring" />
                  <polygon points="26,20 26,44 46,32" className="triangle" />
                </svg>
              </button>
            )}
          </div>

          <div className="details_content">
            <h1 className="details_title">{movie.title}</h1>
            {movie.tagline && (
              <p className="details_tagline">“{movie.tagline}”</p>
            )}

            <div className="details_meta">
              {movie.year && <span className="chip">{movie.year}</span>}
              {movie.runtime ? (
                <span className="chip">{movie.runtime} min</span>
              ) : null}
              {typeof movie.rating === "number" && (
                <span className="chip">⭐ {movie.rating.toFixed(1)}</span>
              )}
            </div>

            {movie.genre.length > 0 && (
              <div className="details_genres">
                {movie.genre.map((g) => (
                  <span className="pill" key={g}>
                    {g}
                  </span>
                ))}
              </div>
            )}

            <p className="details_overview">{movie.overview}</p>

            <div className="toolbar details_actions">
              <Link to="/movies" className="btn btn-outline">
                Back to Popular
              </Link>
              <button
                className={`btn ${inFav(movie) ? "btn-outline" : "btn-accent"}`}
                onClick={() => toggleFavorite(movie)}
              >
                {inFav(movie) ? "Remove Favorite" : "Add to Favorites"}
              </button>
              {ytKey && (
                <button
                  className="watch-trailer"
                  onClick={() => setShowTrailer(true)}
                >
                  Watch Trailer
                </button>
              )}
            </div>

            <ul className="details_facts">
              {movieRaw.spoken_languages?.length ? (
                <li>
                  <strong>Language:</strong>{" "}
                  {movieRaw.spoken_languages
                    .map((l) => l.english_name || l.name)
                    .join(", ")}
                </li>
              ) : null}
              {movie.release_date ? (
                <li>
                  <strong>Release:</strong> {movie.release_date}
                </li>
              ) : null}
              {movieRaw.status ? (
                <li>
                  <strong>Status:</strong> {movieRaw.status}
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </Container>

      <Modal
        show={showTrailer}
        onHide={() => setShowTrailer(false)}
        centered
        size="lg"
        contentClassName="trailer-modal"
      >
        <Modal.Body className="model-body">
          {showTrailer && ytKey && (
            <div className="trailer-ratio">
              <iframe
                src={`https://www.youtube.com/embed/${ytKey}?autoplay=1&rel=0`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default MovieDetails;
