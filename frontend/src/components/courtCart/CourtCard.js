import React from "react";
import { Link } from "react-router-dom";
import "./CourtCard.css";

const CourtCard = ({ court }) => {
  return (
    <Link to={`/courts/${court._id}`} className="court-card-link">
      <div className="court-card">
        <img
          className="court-image"
          src={court.images[0]}
          alt={court.name}
        />

        <h2 className="court-name">{court.name}</h2>

        <p className="court-location">
          {court.district} - {court.city}
        </p>

        <p className="court-rating">⭐ {court.rating}</p>

        <p className="court-features">
          {court.features.lighting ? "Işıklı" : "Işıksız"} |{" "}
          {court.features.indoor ? "Kapalı" : "Açık"}
        </p>

        <div className="court-tags">
          {court.tags.map((tag) => (
            <span key={tag} className="court-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default CourtCard;