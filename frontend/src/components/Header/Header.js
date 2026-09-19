import React, { useCallback, useEffect, useState } from "react";
import "./Header.css";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/LogoDetay1.png";

const Header = () => {
  const navigate = useNavigate();

  const getStoredUser = () => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  };

  const [user, setUser] = useState(getStoredUser());
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      const notifications = await response.json();

      const count = notifications.filter(
        (notification) =>
          notification.status === "pending" &&
          notification.isRead === false
      ).length;

      setUnreadCount(count);
    } catch (error) {
      console.error(
        "Header notification count error:",
        error
      );
    }
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getStoredUser());
      loadUnreadCount();
    };

    const handleNotificationChange = () => {
      loadUnreadCount();
    };

    window.addEventListener(
      "authChanged",
      handleAuthChange
    );

    window.addEventListener(
      "notificationsChanged",
      handleNotificationChange
    );

    loadUnreadCount();

    return () => {
      window.removeEventListener(
        "authChanged",
        handleAuthChange
      );

      window.removeEventListener(
        "notificationsChanged",
        handleNotificationChange
      );
    };
  }, [loadUnreadCount]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setUnreadCount(0);

    window.dispatchEvent(new Event("authChanged"));

    navigate("/login");
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
            <NavLink
              to="/notifications"
              className="notification-link"
              aria-label="Bildirimler"
              title="Bildirimler"
            >
              <span className="notification-bell">
                🔔
              </span>

              {unreadCount > 0 && (
                <span className="notification-badge">
                  {unreadCount > 99
                    ? "99+"
                    : unreadCount}
                </span>
              )}
            </NavLink>

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