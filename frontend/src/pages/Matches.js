import React, { useState } from "react";
import MatchCard from "../components/MatchCard/MatchCard";
import matchesData from "../data/matches.json";
import "./Matches.css";

const Matches = () => {
  const [district, setDistrict] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const districts = [...new Set(matchesData.map((match) => match.district))];

  const filteredMatches = matchesData.filter((match) => {
    const matchesDistrict =
      district === "all" || match.district === district;

    const matchesSearch = match.courtName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesDistrict && matchesSearch;
  });

  return (
    <div className="matches-page">
      <h1 className="matches-title">Aktif Maçlar</h1>

      <div className="matches-filter">
        <input
          className="match-search-input"
          type="text"
          placeholder="Maç ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="district-select"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        >
          <option value="all">Tümü</option>

          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

      <div className="matches-grid">
        {filteredMatches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
};

export default Matches;