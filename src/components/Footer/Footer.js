import React from "react";
import "./styles.css";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <p>Copyright © {year} Movie Finder. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
