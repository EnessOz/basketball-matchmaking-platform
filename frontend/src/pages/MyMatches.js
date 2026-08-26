import React, { useEffect, useState } from "react";
import "./MyMatches.css";

const MyMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Maçlarını görmek için giriş yapmalısın.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/matches/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Maçlar alınamadı");
        }

        setMatches(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("My matches could not be loaded:", error);
        setMessage(error.message);
        setLoading(false);
      });
  }, []);

  const handleDeleteMatch = async (matchId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Maç silmek için giriş yapmalısın.");
      return;
    }

    const confirmed = window.confirm(
      "Bu maçı silmek istediğine emin misin?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/matches/${matchId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Maç silinemedi");
        return;
      }

      setMatches((currentMatches) =>
        currentMatches.filter((match) => match._id !== matchId)
      );

      setMessage("Maç başarıyla silindi.");
    } catch (error) {
      console.error("Match could not be deleted:", error);
      setMessage("Sunucuya bağlanılamadı");
    }
  };

  if (loading) {
    return (
      <div className="my-matches-page">
        <p>Maçların yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="my-matches-page">
      <div className="my-matches-container">
        <h1>Maçlarım</h1>

        {message && <p>{message}</p>}

        {matches.length === 0 && (
          <p>Henüz oluşturduğun bir maç yok.</p>
        )}

        <div className="my-matches-list">
          {matches.map((match) => (
            <div className="my-match-card" key={match._id}>
              <h2>{match.courtName}</h2>

              <p>📍 {match.district}</p>
              <p>📅 {match.date}</p>
              <p>🕒 {match.time}</p>
              <p>🏀 {match.playerCount} Oyuncu</p>

              <p>{match.description}</p>

              <button
                className="delete-match-button"
                onClick={() => handleDeleteMatch(match._id)}
              >
                Maçı Sil
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyMatches;