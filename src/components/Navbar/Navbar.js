
import React from 'react';
import './styles.css';
import { Link, NavLink } from 'react-router-dom';
import {Navbar, Container, Nav} from 'react-bootstrap';

const AppNavbar = () => {
  return (
    <Navbar expand="lg" data-bs-theme="light" sticky="top" className="navbar-style">
      <Container>
        <Navbar.Brand as={Link} to="/" className='nav-brand'>🎬 MovieFinder</Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto nav-links">
            <Nav.Link as={NavLink} end to="/">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/movies">Popular</Nav.Link>
            <Nav.Link as={NavLink} to="/genres">Genres</Nav.Link>
            <Nav.Link as={NavLink} to="/favorites">Favorites</Nav.Link>
            <Nav.Link as={NavLink} to="/contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
