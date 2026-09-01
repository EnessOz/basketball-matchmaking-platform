import React, { useEffect, useState } from "react";
import MatchCard from "../components/MatchCard/MatchCard";
import "./Matches.css";

const Matches = () => {
  const [matchesData, setMatchesData] = useState([]);
  const [district, setDistrict] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    fetch("http://localhost:5000/matches")
      .then((response) => response.json())
      .then((data) => setMatchesData(data))
      .catch((error) => console.error(error));
  }, []);

  const districts = [
    ...new Set(matchesData.map((match) => match.district)),
  ];

  const filteredMatches = matchesData.filter((match) => {
    const matchesDistrict =
      district === "all" || match.district === district;

    const matchesSearch = match.courtName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const isCreator =
      user &&
      match.createdBy?.toString() === user.id;

    const isParticipant =
      user &&
      match.participants?.some(
        (participantId) =>
          participantId.toString() === user.id
      );

    const isJoinedMatch =
      isParticipant && !isCreator;

    let matchesTab = true;

    if (activeTab === "created") {
      matchesTab = isCreator;
    }

    if (activeTab === "joined") {
      matchesTab = isJoinedMatch;
    }

    return (
      matchesDistrict &&
      matchesSearch &&
      matchesTab
    );
  });

  return (
    <div className="matches-page">
      <h1 className="matches-title">Maçlar</h1>

      <div className="matches-tabs">
        <button
          className={`matches-tab ${
            activeTab === "all" ? "active" : ""
          }`}
          onClick={() => setActiveTab("all")}
        >
          Tüm Maçlar
        </button>

        <button
          className={`matches-tab ${
            activeTab === "created" ? "active" : ""
          }`}
          onClick={() => setActiveTab("created")}
        >
          Oluşturduğum Maçlar
        </button>

        <button
          className={`matches-tab ${
            activeTab === "joined" ? "active" : ""
          }`}
          onClick={() => setActiveTab("joined")}
        >
          Katıldığım Maçlar
        </button>
      </div>

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
            <option
              key={district}
              value={district}
            >
              {district}
            </option>
          ))}
        </select>
      </div>

      {activeTab !== "all" && !user ? (
        <p className="matches-login-message">
          Bu maçları görmek için giriş yapmalısın.
        </p>
      ) : (
        <div className="matches-grid">
          {filteredMatches.map((match) => {
            const isCreator =
              user &&
              match.createdBy?.toString() === user.id;

            return (
              <MatchCard
                key={match._id}
                match={match}
                isCreator={isCreator}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Matches;