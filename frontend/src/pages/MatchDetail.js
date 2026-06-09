import React, { useState } from "react";
import { useParams } from "react-router-dom";
import matchesData from "../data/matches.json";
import "./MatchDetail.css";

const MatchDetail = () => {
  const { id } = useParams();

  const match = matchesData.find((match) => match.id === Number(id));

  const [joined, setJoined] = useState(false);
  const [currentPlayerCount, setCurrentPlayerCount] = useState(
    match ? Number(match.playerCount) : 0
  );

  if (!match) {
    return (
      <div className="match-detail-page">
        <h1>Maç bulunamadı</h1>
        <p>Aradığın maç mevcut değil.</p>
      </div>
    );
  }

  const handleJoinMatch = () => {
    if (joined) return;

    setCurrentPlayerCount(currentPlayerCount + 1);
    setJoined(true);
  };

  return (
    <div className="match-detail-page">
      <div className="match-detail-container">
        <h1 className="match-detail-title">{match.courtName}</h1>

        <div className="match-detail-info">
          <p>📍 {match.district}</p>
          <p>📅 {match.date}</p>
          <p>🕒 {match.time}</p>
          <p>🏀 {currentPlayerCount} Oyuncu</p>
        </div>

        <div className="match-detail-description">
          <h2>Maç Açıklaması</h2>
          <p>{match.description}</p>
        </div>

        {joined && (
          <p className="match-join-message">
            Maça katıldın.
          </p>
        )}

        <div className="match-detail-actions">
          <button
            onClick={handleJoinMatch}
            disabled={joined}
          >
            {joined ? "Katıldın" : "Maça Katıl"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchDetail;