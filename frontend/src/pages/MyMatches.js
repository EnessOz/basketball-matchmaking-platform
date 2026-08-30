import React, { useEffect, useState } from "react";
import "./MyMatches.css";

const MyMatches = () => {
  const [createdMatches, setCreatedMatches] = useState([]);
  const [joinedMatches, setJoinedMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!token || !user) {
      setMessage("Maçlarını görmek için giriş yapmalısın.");
      setLoading(false);
      return;
    }

    const loadMatches = async () => {
      try {
        const [createdResponse, joinedResponse] = await Promise.all([
          fetch("http://localhost:5000/matches/my", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch("http://localhost:5000/matches/joined", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const createdData = await createdResponse.json();
        const joinedData = await joinedResponse.json();

        if (!createdResponse.ok) {
          throw new Error(
            createdData.message || "Oluşturduğun maçlar alınamadı"
          );
        }

        if (!joinedResponse.ok) {
          throw new Error(
            joinedData.message || "Katıldığın maçlar alınamadı"
          );
        }

        setCreatedMatches(createdData);

        const onlyJoinedMatches = joinedData.filter(
          (match) => match.createdBy !== user.id
        );

        setJoinedMatches(onlyJoinedMatches);
      } catch (error) {
        console.error("Matches could not be loaded:", error);
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
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

      setCreatedMatches((currentMatches) =>
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

        <h2>Oluşturduğum Maçlar</h2>

        {createdMatches.length === 0 && (
          <p>Henüz oluşturduğun bir maç yok.</p>
        )}

        <div className="my-matches-list">
          {createdMatches.map((match) => (
            <div className="my-match-card" key={match._id}>
              <h2>{match.courtName}</h2>

              <p>📍 {match.district}</p>
              <p>📅 {match.date}</p>
              <p>🕒 {match.time}</p>
              <p>
                🏀 {match.participants?.length || 0} Katılımcı
              </p>

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

        <h2>Katıldığım Maçlar</h2>

        {joinedMatches.length === 0 && (
          <p>Henüz katıldığın bir maç yok.</p>
        )}

        <div className="my-matches-list">
          {joinedMatches.map((match) => (
            <div className="my-match-card" key={match._id}>
              <h2>{match.courtName}</h2>

              <p>📍 {match.district}</p>
              <p>📅 {match.date}</p>
              <p>🕒 {match.time}</p>
              <p>
                🏀 {match.participants?.length || 0} Katılımcı
              </p>

              <p>{match.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyMatches;