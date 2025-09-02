import axios from "axios";

const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL;
const API_KEY = process.env.REACT_APP_TMDB_KEY;
const ACCESS_TOKEN = process.env.REACT_APP_TMDB_ACCESS_TOKEN;

// Function to fetch the data
export const fetchMovies = async (endpoint) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

// Get popular movies
export const getPopularMovies = (page = 1) => {
  return fetchMovies(
    `/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
  );
};

// Get top rated movies
export const getTopRatedMovies = (page = 1) => {
  return fetchMovies(
    `/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`
  );
};

// Get upcoming movies
export const getUpcomingMovies = (page = 1) => {
  return fetchMovies(
    `/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`
  );
};

// Get movies details
export const getMovieDetails = (movieId) => {
  return fetchMovies(`/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
};

// Search movies
export const searchMovies = (query, page = 1) => {
  return fetchMovies(
    `/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );
};

// Get all movies
export const getMovie = (id) => {
  return fetchMovies(`/movie/${id}?api_key=${API_KEY}&language=en-US`);
};

// Get genres
export const getGeneres = () => {
  return fetchMovies(`/genre/movie/list?api_key=${API_KEY}&language=en-US`);
};

// Discover movies by genre
export const discoverByGenre = (genreId, page = 1) => {
  return fetchMovies(
    `/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&with_genres=${genreId}&page=${page}`
  );
};

//Discover movies by country
export const discoverByCountry = (
  countryCode,
  page = 1,
  {
    sortBy = "primary_release_date.desc",
    from,
    to = new Date().toISOString().slice(0, 10),
    minVotes = 50,
    originalLanguage,
  } = {}
) => {
  const params = new URLSearchParams({
    api_key: API_KEY,
    language: "en-US",
    sort_by: sortBy,
    include_adult: "false",
    page: String(page),
    "vote_count.gte": String(minVotes),
  });

  // Only add country filter when a real country is selected
  if (countryCode && countryCode !== "All") {
    params.set("with_origin_country", countryCode);
  }

  if (from) params.set("primary_release_date.gte", from);
  if (to) params.set("primary_release_date.lte", to);

  if (originalLanguage && originalLanguage !== "Any") {
    params.set("with_original_language", originalLanguage.toLowerCase());
  }

  return fetchMovies(`/discover/movie?${params.toString()}`);
};

//List of supported languages
export const getLanguages = () => {
  return fetchMovies(`/configuration/languages?api_key=${API_KEY}`);
};

// Get video of movie
export const getMovieVideos = (movieId) => {
  return fetchMovies(
    `/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
  );
};

// Get movie image
export const img = (path, size = "w342") => {
  return path
    ? `https://image.tmdb.org/t/p/${size}${path}`
    : "https://via.placeholder.com/342x513?text=No+Image";
};
