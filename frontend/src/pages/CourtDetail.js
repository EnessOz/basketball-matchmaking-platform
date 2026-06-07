import React from "react";
import { Link, useParams } from "react-router-dom";
import courtsData from "../data/courts.json";
import "./CourtDetail.css";

const CourtDetail = () => {
  const { id } = useParams();

  const court = courtsData.find((court) => court.id === Number(id));

  if (!court) {
    return (
      <div className="court-detail-page">
        <h1>Saha bulunamadı</h1>
        <p>Aradığın saha mevcut değil.</p>
      </div>
    );
  }

  const googleMapsUrl = `https://www.google.com/maps?q=${court.location.lat},${court.location.lng}`;

  return (
    <div className="court-detail-page">
      <div className="court-detail-container">
        <img
          className="court-detail-image"
          src={court.images[0]}
          alt={court.name}
        />

        <div className="court-detail-content">
          <h1 className="court-detail-title">{court.name}</h1>

          <p className="court-detail-location">
            {court.district} - {court.city}
          </p>

          <p className="court-detail-address">{court.location.address}</p>

          <div className="court-detail-info">
            <p>⭐ {court.rating}</p>
            <p>{court.features.lighting ? "Işıklı" : "Işıksız"}</p>
            <p>{court.features.indoor ? "Kapalı" : "Açık"}</p>
            <p>{court.features.rim_count} pota</p>
          </div>

          <div className="court-detail-tags">
            {court.tags.map((tag) => (
              <span key={tag} className="court-detail-tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="court-detail-actions">
            <button className="court-detail-button">
              Favorilere Ekle
            </button>

            <a
              className="court-detail-button"
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Google Maps'te Aç
            </a>

            <Link
              className="court-detail-button primary"
              to={`/courts/${court.id}/create-match`}
            >
              Bu Sahada Maç Oluştur
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtDetail;