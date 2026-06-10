import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>Hakkımızda</h1>

        <p>
          Basketball Matchmaking Platform, basketbol oyuncularının saha bulmasını,
          aktif maçları görüntülemesini ve yeni maçlar oluşturmasını kolaylaştırmak
          amacıyla geliştirilen bir projedir.
        </p>

        <p>
          Amaç, basketbol oynamak isteyen kişileri aynı sahada ve aynı zamanda
          bir araya getirebilecek basit ve kullanışlı bir platform oluşturmaktır.
        </p>

        <div className="about-section">
          <h2>Proje Hedefleri</h2>

          <ul>
            <li>Basketbol sahalarını listelemek</li>
            <li>Aktif maçları görüntülemek</li>
            <li>Yeni maç oluşturmak</li>
            <li>Oyuncuların birbirini bulmasını kolaylaştırmak</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;