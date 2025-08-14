import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

const Button = ({ href, text, outline }) => {
  return !!outline ? (
    <Link to={href} className="btn btn-outline">
      {text}
    </Link>
  ) : (
    <Link to={href} className="btn btn-accent">
      {text}
    </Link>
  );
};

export default Button;
