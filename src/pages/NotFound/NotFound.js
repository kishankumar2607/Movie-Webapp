import React from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import "./styles.css";

const NotFound = () => (
  <section className="notfound">
    <div className="hero_bg" aria-hidden="true" />
    <Container className="nf_wrap">
      <div className="nf_panel">
        <p className="nf_oops">Oops…</p>
        <h1 className="nf_code" aria-label="404">
          404
        </h1>
        <p className="nf_text">
          The page you’re looking for doesn’t exist or has moved.
        </p>

        <div className="nf_actions">
          <Link to="/" className="btn btn-light">
            Go Home
          </Link>
          <Link to="/movies" className="btn btn-accent">
            Browse Movies
          </Link>
          <Link to="/genres" className="btn btn-outline">
            Browse by Genre
          </Link>
        </div>
      </div>
    </Container>
  </section>
);

export default NotFound;
