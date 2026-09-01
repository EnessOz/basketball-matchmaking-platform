import React, { useEffect, useState } from "react";
import CourtCard from "../components/courtCart/CourtCard";
import "./Courts.css";

const Courts = () => {
  const [courtsData, setCourtsData] = useState([]);
  const [favoriteCourts, setFavoriteCourts] = useState([]);
  const [district, setDistrict] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/courts")
      .then((response) => response.json())
      .then((data) => setCourtsData(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (!token) {
      setFavoriteCourts([]);
      return;
    }

    fetch("http://localhost:5000/users/favorites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setFavoriteCourts(data))
      .catch((error) => {
        console.error("Favorite courts could not be loaded:", error);
      });
  }, [token]);

  const districts = [...new Set(courtsData.map((c) => c.district))];

  const filteredCourts = courtsData.filter((court) => {
    const matchesDistrict =
      district === "all" || court.district === district;

    const matchesSearch = court.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const isFavorite = favoriteCourts.some(
      (favoriteCourt) => favoriteCourt._id === court._id
    );

    const matchesTab =
      activeTab === "all" || isFavorite;

    return (
      matchesDistrict &&
      matchesSearch &&
      matchesTab
    );
  });

  return (
    <div className="courts-page">
      <h1 className="courts-title">Basket Sahaları</h1>

      <div className="courts-tabs">
        <button
          className={`courts-tab ${
            activeTab === "all" ? "active" : ""
          }`}
          onClick={() => setActiveTab("all")}
        >
          Tüm Sahalar
        </button>

        <button
          className={`courts-tab ${
            activeTab === "favorites" ? "active" : ""
          }`}
          onClick={() => setActiveTab("favorites")}
        >
          Favori Sahalarım
        </button>
      </div>

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
        {filteredCourts.map((court) => {
          const isFavorite = favoriteCourts.some(
            (favoriteCourt) => favoriteCourt._id === court._id
          );

          return (
            <CourtCard
              key={court._id}
              court={court}
              isFavorite={isFavorite}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Courts;