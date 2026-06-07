import React, { useState } from "react";
import { useParams } from "react-router-dom";
import courtsData from "../data/courts.json";
import "./CreateMatch.css";

const CreateMatch = () => {
  const { id } = useParams();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [playerCount, setPlayerCount] = useState("");
  const [description, setDescription] = useState("");
  const [createdMatch, setCreatedMatch] = useState(null);

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const currentTime = now.toTimeString().slice(0, 5);

  const court = courtsData.find((court) => court.id === Number(id));

  const handleSubmit = (e) => {
    e.preventDefault();

    const match = {
      courtId: court.id,
      courtName: court.name,
      date,
      time,
      playerCount,
      description,
    };

    setCreatedMatch(match);

    console.log("Match Created:");
    console.log(match);
  };

  if (!court) {
    return (
      <div className="create-match-page">
        <h1>Saha bulunamadı</h1>
        <p>Maç oluşturmak istediğin saha mevcut değil.</p>
      </div>
    );
  }

  return (
    <div className="create-match-page">
      <div className="create-match-container">
        <h1>Maç Oluştur</h1>

        <p className="create-match-court-name">{court.name}</p>

        <p className="create-match-court-location">
          {court.district} - {court.city}
        </p>

        <form className="create-match-form" onSubmit={handleSubmit}>
          <label>
            Tarih
            <input
              type="date"
              required
              value={date}
              min={today}
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
              }}
            />
          </label>

          <label>
            Saat
            <input
              type="time"
              required
              value={time}
              min={date === today ? currentTime : undefined}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>

          <label>
            Oyuncu Sayısı
            <input
              type="number"
              min="1"
              max="20"
              placeholder="Örn: 10"
              required
              value={playerCount}
              onChange={(e) => setPlayerCount(e.target.value)}
            />
          </label>

          <label>
            Açıklama
            <textarea
              placeholder="Maç hakkında kısa bilgi yaz..."
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <button type="submit">Maçı Oluştur</button>
        </form>

        {createdMatch && (
          <div className="created-match-card">
            <h2>Maç Oluşturuldu</h2>

            <p>
              <strong>Saha:</strong> {createdMatch.courtName}
            </p>

            <p>
              <strong>Tarih:</strong> {createdMatch.date}
            </p>

            <p>
              <strong>Saat:</strong> {createdMatch.time}
            </p>

            <p>
              <strong>Oyuncu Sayısı:</strong> {createdMatch.playerCount}
            </p>

            <p>
              <strong>Açıklama:</strong> {createdMatch.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateMatch;