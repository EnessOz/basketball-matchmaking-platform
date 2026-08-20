import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./MatchDetail.css";

const MatchDetail = () => {
  const { id } = useParams();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  const [joined, setJoined] = useState(false);
  const [currentPlayerCount, setCurrentPlayerCount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/matches")
      .then((response) => response.json())
      .then((data) => {
        const foundMatch = data.find((match) => match._id === id);

        setMatch(foundMatch);

        if (foundMatch) {
          setCurrentPlayerCount(Number(foundMatch.playerCount));
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Match could not be loaded:", error);
        setLoading(false);
      });
  }, [id]);

  const handleJoinMatch = async () => {
    if (joined) return;

    try {
      const response = await fetch(
        `http://localhost:5000/matches/${id}/join`,
        {
          method: "PATCH",
        }
      );

      const updatedMatch = await response.json();

      setMatch(updatedMatch);
      setCurrentPlayerCount(updatedMatch.playerCount);
      setJoined(true);
    } catch (error) {
      console.error("Could not join match:", error);
    }
  };

  if (loading) {
    return (
      <div className="match-detail-page">
        <p>Maç yükleniyor...</p>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="match-detail-page">
        <h1>Maç bulunamadı</h1>
        <p>Aradığın maç mevcut değil.</p>
      </div>
    );
  }

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