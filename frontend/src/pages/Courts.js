import React, { useState } from "react";
import courtsData from "../data/courts.json";
import CourtCard from "../components/courtCart/CourtCard";
import "./Courts.css";

const Courts = () => {
  const [district, setDistrict] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const districts = [...new Set(courtsData.map((c) => c.district))];

  const filteredCourts = courtsData.filter((court) => {
    const matchesDistrict =
      district === "all" || court.district === district;

    const matchesSearch = court.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesDistrict && matchesSearch;
  });

  return (
    <div className="courts-page">
      <h1 className="courts-title">Basket Sahaları</h1>

      <div className="courts-filter">
        <input
          className="court-search-input"
          type="text"
          placeholder="Saha ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

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