import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home-page-container">
      <section className="home-hero">
        <div className="home-hero-content">
          <h1>Basketbol sahasını bul, maçını kur.</h1>

          <p>
            Yakındaki basketbol sahalarını keşfet, aktif maçlara göz at ve
            kendi maçını oluştur.
          </p>

          <div className="home-actions">
            <Link to="/courts" className="home-primary-button">
              Sahaları Keşfet
            </Link>

            <Link to="/matches" className="home-secondary-button">
              Aktif Maçlar
            </Link>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="home-feature-card">
          <h2>🏀 Sahaları Bul</h2>
          <p>Semte göre basketbol sahalarını listele ve detaylarını gör.</p>
        </div>

        <div className="home-feature-card">
          <h2>📅 Maç Oluştur</h2>
          <p>Seçtiğin sahada tarih, saat ve oyuncu sayısı belirle.</p>
        </div>

        <div className="home-feature-card">
          <h2>🤝 Maça Katıl</h2>
          <p>Aktif maçları incele ve uygun olan maça katıl.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;