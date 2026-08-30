import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MatchDetail.css";

const MatchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    fetch("http://localhost:5000/matches")
      .then((response) => response.json())
      .then((data) => {
        const foundMatch = data.find((match) => match._id === id);

        setMatch(foundMatch);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Match could not be loaded:", error);
        setLoading(false);
      });
  }, [id]);

  const isCreator =
    match &&
    user &&
    match.createdBy?.toString() === user.id;

  const isJoined =
    match &&
    user &&
    match.participants?.some(
      (participantId) => participantId.toString() === user.id
    );

  const handleJoinMatch = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Maça katılmak için giriş yapmalısın.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/matches/${id}/join`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Maça katılınamadı.");
        return;
      }

      setMatch(data);
      setMessage("Maça katıldın.");
    } catch (error) {
      console.error("Could not join match:", error);
      setMessage("Sunucuya bağlanılamadı.");
    }
  };

  const handleLeaveMatch = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Maçtan ayrılmak için giriş yapmalısın.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/matches/${id}/leave`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Maçtan ayrılınamadı.");
        return;
      }

      setMatch(data);
      setMessage("Maçtan ayrıldın.");
    } catch (error) {
      console.error("Could not leave match:", error);
      setMessage("Sunucuya bağlanılamadı.");
    }
  };

  const handleDeleteMatch = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Maçı silmek için giriş yapmalısın.");
      return;
    }

    const confirmed = window.confirm(
      "Bu maçı silmek istediğine emin misin?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/matches/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Maç silinemedi.");
        return;
      }

      navigate("/matches");
    } catch (error) {
      console.error("Match could not be deleted:", error);
      setMessage("Sunucuya bağlanılamadı.");
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

          <p className="match-participant-info">
            🏀 {match.participants?.length || 0} Katılımcı

            <span className="participation-status">
              <span className="participation-dot"></span>
              Katılım Aktif
            </span>
          </p>
        </div>

        <div className="match-detail-description">
          <h2>Maç Açıklaması</h2>
          <p>{match.description}</p>
        </div>

        {message && (
          <p className="match-join-message">
            {message}
          </p>
        )}

        <div className="match-detail-actions">
          {isCreator ? (
            <>
              <p>🏆 Bu maçı sen oluşturdun.</p>

              <button
                className="delete-match-button"
                onClick={handleDeleteMatch}
              >
                Maçı Sil
              </button>
            </>
          ) : isJoined ? (
            <button onClick={handleLeaveMatch}>
              Maçtan Ayrıl
            </button>
          ) : (
            <button onClick={handleJoinMatch}>
              Maça Katıl
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetail;