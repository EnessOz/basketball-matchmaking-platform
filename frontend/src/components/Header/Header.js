import React from "react";
import "./Header.css";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/LogoDetay1.png";

const Header = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

    window.location.reload();
  };

  return (
    <header className="header-container">
      <div className="header-brand">
        <img
          className="logo-img"
          src={logo}
          alt="Basketball Matchmaking Logo"
        />

        <span className="brand-name">CourtMatch</span>
      </div>

      <nav className="header-left">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive
              ? "header-link header-active"
              : "header-link"
          }
        >
          Anasayfa
        </NavLink>

        <NavLink
          to="/courts"
          className={({ isActive }) =>
            isActive
              ? "header-link header-active"
              : "header-link"
          }
        >
          Sahalar
        </NavLink>

        <NavLink
          to="/matches"
          className={({ isActive }) =>
            isActive
              ? "header-link header-active"
              : "header-link"
          }
        >
          Aktif Maçlar
        </NavLink>

        {user && (
          <NavLink
            to="/my-matches"
            className={({ isActive }) =>
              isActive
                ? "header-link header-active"
                : "header-link"
            }
          >
            Maçlarım
          </NavLink>
        )}
      </nav>

      <div className="header-right">
        {user ? (
          <>
            <span className="header-link">
              {user.username}
            </span>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Çıkış Yap
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? "header-link header-active"
                  : "header-link"
              }
            >
              Giriş
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive
                  ? "register-link header-active"
                  : "register-link"
              }
            >
              Kayıt Ol
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;