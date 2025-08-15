import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import Button from "../../components/Button/Button";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

const trendingGenres = [
  "Action",
  "Drama",
  "Sci-Fi",
  "Thriller",
  "Crime",
  "Adventure",
];

const Home = () => (
  <>
    <Helmet>
      <title>MovieFinder - Find Your Next Favorite Movie</title>
      <meta
        name="description"
        content="Discover popular movies, browse by genre, save favorites - fast and accessible."
      />
    </Helmet>

    <section className="home">
      <div className="hero">
        <div className="hero_bg" aria-hidden="true" />
        <Container className="hero_inner">
          <div className="hero_text">
            <h1 className="hero_title">
              Find Your <span>Next Favorite</span> Movie
            </h1>
            <p className="hero_subtitle">
              Browse pupular movies and add in your next favorite. Discover new
              movies, explore genres, and stay updated with the latest releases.
            </p>
            <div className="hero_actions">
              <Button href="/movies" text="Explore Popular" />
              <Button href="/genres" text="Browse by Genre" outline />
            </div>
          </div>
          <div className="hero_img-div">
            <img
              src="/assets/images/hero-banner.png"
              alt="Movie poster"
              className="hero_image"
            />
          </div>
        </Container>
      </div>

      <Container className="feature-section">
        <h2 className="section_title">Why MovieFinder?</h2>
        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-card_icon">🔎</div>
            <h3>Smart Search</h3>
            <p>
              Quickly search by title or year and jump straight into details of
              a movie.
            </p>
          </article>
          <article className="feature-card">
            <div className="feature-card_icon">🎛️</div>
            <h3>Genre Filters</h3>
            <p>
              See exactly what you’re in the mood for — Action, Drama, Sci-Fi,
              and more.
            </p>
          </article>
          <article className="feature-card">
            <div className="feature-card_icon">⭐</div>
            <h3>Save Favorites</h3>
            <p>
              Keep a personal watchlist of your favorite movies and share them
              with friends.
            </p>
          </article>
          <article className="feature-card">
            <div className="feature-card_icon">⬇️</div>
            <h3>Export List</h3>
            <p>
              Download your favorites movies and shows and watch later as per
              your convinience.
            </p>
          </article>
        </div>
      </Container>

      <div className="section--alt">
        <div className="container">
          <div className="section__header">
            <h2 className="trending-genres__title">Trending Genres</h2>
            <Button href="/genres" text="See all" outline />
          </div>
          <div className="pill-row">
            {trendingGenres.map((g) => (
              <Link key={g} to="/genres" className="pill">
                {g}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="spotlight-section">
        <Container>
          <div className="section__header">
            <h2 className="spotlight-section-title">Spotlight Picks</h2>
            <Button href="/movies" text="View more" outline />
          </div>

          <div className="spotlight-grid">
            <Link to="/movie/tt0111161" className="spotlight-card">
              <div
                className="spotlight-card__img shawshank"
                aria-hidden="true"
              />
              <div className="spotlight-card__body">
                <h3>The Shawshank Redemption</h3>
                <p>Hope sets you free.</p>
              </div>
            </Link>

            <Link to="/movie/tt1375666" className="spotlight-card">
              <div
                className="spotlight-card__img inception"
                aria-hidden="true"
              />
              <div className="spotlight-card__body">
                <h3>Inception</h3>
                <p>Your mind is the scene of the crime.</p>
              </div>
            </Link>

            <Link to="/movie/tt7286456" className="spotlight-card">
              <div className="spotlight-card__img joker" aria-hidden="true" />
              <div className="spotlight-card__body">
                <h3>Joker</h3>
                <p>Put on a happy face.</p>
              </div>
            </Link>
          </div>
        </Container>
      </div>

      <div className="cta">
        <Container className="cta__inner">
          <div className="cta__text">
            <h2>Ready to explore?</h2>
            <p>
              Discover the latest movies, find your favorites, and dive into the
              world of cinema. Browse our extensive collection and start your
              movie journey today!
            </p>
          </div>
          <div className="cta__actions">
            <Button href={"/movies"} text="Explore Popular" outline />
            <Button href={"/genres"} text="Browse by Genre" />
          </div>
        </Container>
      </div>
    </section>
  </>
);

export default Home;
