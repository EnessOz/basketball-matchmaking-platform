import React from "react";
import { Link } from "react-router-dom";
import "./MatchCard.css";

const MatchCard = ({ match, isCreator }) => {
  return (
    <Link
      to={`/matches/${match._id}`}
      className="match-card-link"
    >
      <div className="match-card">
        {isCreator && (
          <div className="match-owner-badge">
            🏆 Senin Maçın
          </div>
        )}

        <h2 className="match-court-name">
          {match.courtName}
        </h2>

        <p className="match-date">
          📅 {match.date}
        </p>

        <p className="match-time">
          🕒 {match.time}
        </p>

        <p className="match-player-count">
          🏀 {match.participants?.length || 0} Katılımcı
        </p>

        <p className="match-description">
          {match.description}
        </p>
      </div>
    </Link>
  );
};

export default MatchCard;