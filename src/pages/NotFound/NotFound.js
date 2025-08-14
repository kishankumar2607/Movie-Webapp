
import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const NotFound = () => (
  <section className="notfound">
    <h1>404 — Page Not Found</h1>
    <p>The page you’re looking for doesn’t exist.</p>
    <Link to="/movies" className="btn btn-small">Browse Movies</Link>
  </section>
);

export default NotFound;
