import React from "react";
import "./Footer.css";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-brand">
        <strong>CourtMatch</strong>
        <span>Basketbol sahalarını keşfet, maçını kur.</span>
      </div>

      <div className="footer-links">
        <NavLink to="/about" className={({ isActive }) => isActive ? "footer-link footer-active" : "footer-link"}>
          Hakkımızda
        </NavLink>

        <NavLink to="/contact" className={({ isActive }) => isActive ? "footer-link footer-active" : "footer-link"}>
          İletişim
        </NavLink>
      </div>
    </footer>
  );
};

export default Footer;