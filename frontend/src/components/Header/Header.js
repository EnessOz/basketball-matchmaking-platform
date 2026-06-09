import React from "react";
import "./Header.css";
import { NavLink } from "react-router-dom";
import logo from "../../assets/LogoDetay1.png";

const Header = () => {
  return (
    <header className="header-container">
      <div className="header-brand">
        <img className="logo-img" src={logo} alt="Basketball Matchmaking Logo" />
        <span className="brand-name">CourtMatch</span>
      </div>

      <nav className="header-left">
        <NavLink to="/" end className={({ isActive }) => isActive ? "header-link header-active" : "header-link"}>
          Anasayfa
        </NavLink>

        <NavLink to="/courts" className={({ isActive }) => isActive ? "header-link header-active" : "header-link"}>
          Sahalar
        </NavLink>

        <NavLink to="/matches" className={({ isActive }) => isActive ? "header-link header-active" : "header-link"}>
          Aktif Maçlar
        </NavLink>
      </nav>

      <div className="header-right">
        <NavLink to="/login" className={({ isActive }) => isActive ? "header-link header-active" : "header-link"}>
          Giriş
        </NavLink>

        <NavLink to="/register" className={({ isActive }) => isActive ? "register-link header-active" : "register-link"}>
          Kayıt Ol
        </NavLink>
      </div>
    </header>
  );
};

export default Header;