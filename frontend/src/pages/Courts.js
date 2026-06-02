import React, { useState } from "react";
import courtsData from "../data/courts.json";
import CourtCard from "../components/courtCart/CourtCard";
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
          <CourtCard key={court.id} court={court} />
        ))}
      </div>
    </div>
  );
};

export default Courts;