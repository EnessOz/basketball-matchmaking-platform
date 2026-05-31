import React from "react";
import "./Header.css";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <div className="header-container">
      <div className="header-left">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Anasayfa
        </NavLink>

        <NavLink to="/courts" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Sahalar
        </NavLink>

        <NavLink to="/matches" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Aktif Maçlar
        </NavLink>
      </div>

      <div className="header-right">
        <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Giriş
        </NavLink>

        <NavLink to="/register" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Kayıt Ol
        </NavLink>
      </div>
    </div>
  );
};

export default Header;