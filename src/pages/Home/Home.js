import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import Button from "../../components/Button/Button";
import { Container } from "react-bootstrap";

const trendingGenres = [
  "Action",
  "Drama",
  "Sci-Fi",
  "Thriller",
  "Crime",
  "Adventure",
];

const Home = () => (
  <section className="home">
    <div className="hero">
      <div className="hero_bg" aria-hidden="true" />
      <div className="container hero_inner">
        <div className="hero_text">
          <h1 className="hero_title">
            Find Your <span>Next Favorite</span> Movie
          </h1>
          <p className="hero_subtitle">
            Browse popular titles, filter by genre, save favorites, and export
            them — all in a fast, accessible React SPA.
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
      </div>
    </div>

    {/* FEATURES */}
    <Container className="feature-section">
      <h2 className="section_title">Why MovieFinder?</h2>
      <div className="feature-grid">
        <article className="feature-card">
          <div className="feature-card_icon">🔎</div>
          <h3>Smart Search</h3>
          <p>
            Quickly search by title or year and jump straight into details of a
            movie.
          </p>
        </article>
        <article className="feature-card">
          <div className="feature-card_icon">🎛️</div>
          <h3>Genre Filters</h3>
          <p>
            See exactly what you’re in the mood for — Action, Drama, Sci-Fi, and
            more.
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
            Download your favorites movies and shows and watch later as per your
            convinience.
          </p>
        </article>
      </div>
    </Container>

    {/* TRENDING GENRES */}
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

    {/* SPOTLIGHT PICKS */}
    <div className="container section">
      <div className="section__header">
        <h2 className="section__title">Spotlight Picks</h2>
        <Link to="/movies" className="link">
          View more
        </Link>
      </div>

      <div className="spotlight-grid">
        <Link to="/movie/tt0111161" className="spotlight-card">
          <div className="spotlight-card__img shawshank" aria-hidden="true" />
          <div className="spotlight-card__body">
            <h3>The Shawshank Redemption</h3>
            <p>Hope sets you free.</p>
          </div>
        </Link>

        <Link to="/movie/tt1375666" className="spotlight-card">
          <div className="spotlight-card__img inception" aria-hidden="true" />
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
    </div>

    {/* CTA BANNER */}
    <div className="cta">
      <div className="container cta__inner">
        <div className="cta__text">
          <h2>Ready to explore?</h2>
          <p className="muted">
            Dive into our popular list or fine-tune by genre.
          </p>
        </div>
        <div className="cta__actions">
          <Link to="/movies" className="btn btn-light">
            Explore Popular
          </Link>
          <Link to="/genres" className="btn btn-outline-light">
            Browse by Genre
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default Home;
