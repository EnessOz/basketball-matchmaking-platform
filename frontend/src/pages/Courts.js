import React, { useState } from "react";
import courtsData from "../data/courts.json";
import "./Courts.css";

const Courts = () => {
  const [district, setDistrict] = useState("all");
  const districts = [...new Set(courtsData.map((c) => c.district))];

  const filteredCourts =
    district === "all"
      ? courtsData
      : courtsData.filter((c) => c.district === district);

  return (
    <div className="courts-page">
      <h1 className="courts-title">Basket Sahaları</h1>

      <div className="courts-filter">
        <select
          className="district-select"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        >
          <option value="all">Tümü</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="courts-grid">
        {filteredCourts.map((court) => (
          <div key={court.id} className="court-card">
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
        ))}
      </div>
    </div>
  );
};

export default Courts;