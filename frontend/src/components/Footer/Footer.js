import React from 'react'
import "./Footer.css";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-left">
        <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Hakkımızda
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          İletişim
        </NavLink>
      </div>
      <div className="footer-right">
      </div>
    </div>
  )
}

export default Footer
