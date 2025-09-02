import React, { useMemo, useState, useEffect, useCallback } from "react";
import "./styles.css";
import { Helmet } from "react-helmet-async";
import { Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../../components/MovieCard/MovieCard";
import Paginator from "../../components/Paginator/Paginator";
import Loader from "../../components/Loader/Loader";
import {
  getGeneres,
  discoverByCountry,
  getLanguages,
  img,
} from "../../api/tmdb";

const COUNTRIES = [
  { code: "All", name: "All" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "IN", name: "India" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "AU", name: "Australia" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "RU", name: "Russia" },
  { code: "CN", name: "China" },
];

const Country = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // init from URL (so Back returns to same filters/page)
  const [selected, setSelected] = useState(
    () => searchParams.get("country") || "All"
  );
  const [lang, setLang] = useState(() => searchParams.get("lang") || "Any");
  const [page, setPage] = useState(() => Number(searchParams.get("page") || 1));

  // keep URL in sync
  useEffect(() => {
    const next = new URLSearchParams();
    next.set("country", selected);
    next.set("lang", lang);
    next.set("page", String(page));
    setSearchParams(next, { replace: true });
  }, [selected, lang, page, setSearchParams]);

  const [langs, setLangs] = useState([{ code: "Any", name: "Any Language" }]);
  const [totalPages, setTotalPages] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // genres lookup
  const [genres, setGenres] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const g = await getGeneres();
        setGenres(g.genres || []);
      } catch {
        setErr("Failed to load genres");
      }
    })();
  }, []);
  const genresById = useMemo(() => {
    const map = {};
    genres.forEach(({ id, name }) => (map[id] = name));
    return map;
  }, [genres]);

  // load ALL languages (for dropdown)
  useEffect(() => {
    (async () => {
      try {
        const data = await getLanguages();
        const mapped = (data || [])
          .filter((l) => l.iso_639_1 && l.iso_639_1 !== "xx")
          .map((l) => ({
            code: l.iso_639_1.toLowerCase(),
            name: l.english_name || l.name || l.iso_639_1.toUpperCase(),
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setLangs([{ code: "Any", name: "Any Language" }, ...mapped]);
      } catch {
        // fallback subset
        setLangs((prev) =>
          prev.length > 1
            ? prev
            : [
                { code: "Any", name: "Any Language" },
                { code: "en", name: "English" },
                { code: "es", name: "Spanish" },
                { code: "fr", name: "French" },
                { code: "de", name: "German" },
                { code: "hi", name: "Hindi" },
                { code: "ja", name: "Japanese" },
                { code: "ko", name: "Korean" },
                { code: "zh", name: "Chinese" },
                { code: "it", name: "Italian" },
                { code: "pt", name: "Portuguese" },
                { code: "ru", name: "Russian" },
              ]
        );
      }
    })();
  }, []);

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
  const toggleFavorite = (appMovie) => {
    setFavorites((prev) =>
      inFavById(appMovie.id)
        ? prev.filter((f) => f.id !== appMovie.id)
        : [...prev, appMovie]
    );
  };

  // reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selected, lang]);

  // fetch newest → oldest (global or per-country), language-aware
  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const data = await discoverByCountry(selected, page, {
          sortBy: "primary_release_date.desc",
          to: today, // exclude unreleased
          minVotes: 50,
          originalLanguage: lang !== "Any" ? lang : undefined,
        });
        setItems(data.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 500));
      } catch {
        setErr("Failed to load movies");
      } finally {
        setLoading(false);
      }
    })();
  }, [selected, lang, page]);

  // surface languages present in current results
  const presentLangCodes = useMemo(() => {
    return new Set(
      (items || [])
        .map((m) => (m.original_language || "").toLowerCase())
        .filter(Boolean)
    );
  }, [items]);
  const availableLangs = useMemo(
    () => langs.filter((l) => l.code !== "Any" && presentLangCodes.has(l.code)),
    [langs, presentLangCodes]
  );
  const allOtherLangs = useMemo(
    () =>
      langs.filter((l) => l.code !== "Any" && !presentLangCodes.has(l.code)),
    [langs, presentLangCodes]
  );

  const countryName = (code) =>
    COUNTRIES.find((c) => c.code === code)?.name || "Country";
  const langName = (code) => langs.find((l) => l.code === code)?.name || "";

  const isAll = selected === "All";
  const titleText = isAll
    ? `Newest Movies${page > 1 ? ` - Page ${page}` : ""} - MovieFinder`
    : `Country: ${countryName(selected)}${
        lang !== "Any" ? ` • ${langName(lang)}` : ""
      }${page > 1 ? ` - Page ${page}` : ""} - MovieFinder`;
  const descText = isAll
    ? "All movies, newest to oldest. Filter by original language and save favorites."
    : `Newest releases from ${countryName(selected)}${
        lang !== "Any" ? ` in ${langName(lang)}` : ""
      }. Save favorites and export your list.`;

  return (
    <>
      <Helmet>
        <title>{titleText}</title>
        <meta name="description" content={descText} />
      </Helmet>

      {/* Reuse Genres styles for consistency */}
      <section className="genres">
        <div className="hero_bg" aria-hidden="true" />
        <Container>
          <div className="genres_header">
            <h1>
              {isAll ? "Newest Movies" : `Country: ${countryName(selected)}`}
            </h1>

            <div className="toolbar" style={{ display: "flex", gap: 8 }}>
              {/* Country */}
              <label htmlFor="country" className="sr-only">
                Country
              </label>
              <select
                id="country"
                className="input select"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                aria-label="Select a country"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Language */}
              <label htmlFor="lang" className="sr-only">
                Language
              </label>
              <select
                id="lang"
                className="input select"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                aria-label="Filter by original language"
              >
                <option value="Any">Any Language</option>

                {availableLangs.length > 0 && (
                  <optgroup label="Available now">
                    {availableLangs.map((l) => (
                      <option key={`avail-${l.code}`} value={l.code}>
                        {l.name} ({l.code})
                      </option>
                    ))}
                  </optgroup>
                )}

                <optgroup label="All languages">
                  {allOtherLangs.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name} ({l.code})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {err && <p className="muted">{err}</p>}
          {loading && <Loader />}

          {!loading && items.length === 0 && (
            <div className="empty-state" role="status" aria-live="polite">
              <h2>No results found</h2>
              <p className="muted">
                Try a different country, broaden the language to “Any”, or check
                again later.
              </p>
            </div>
          )}

          <div className="genres-list">
            {!loading &&
              items.map((m) => {
                const appMovie = {
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

export default Country;
