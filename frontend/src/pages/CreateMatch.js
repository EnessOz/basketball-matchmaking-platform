import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CreateMatch.css";

const CreateMatch = () => {
  const { id } = useParams();

  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [createdMatch, setCreatedMatch] = useState(null);
  const [message, setMessage] = useState("");

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const currentTime = now.toTimeString().slice(0, 5);

  useEffect(() => {
    fetch("http://localhost:5000/courts")
      .then((response) => response.json())
      .then((data) => {
        const foundCourt = data.find((court) => court._id === id);

        setCourt(foundCourt);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Court could not be loaded:", error);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Maç oluşturmak için giriş yapmalısın.");
      return;
    }

    const match = {
      courtId: court._id,
      courtName: court.name,
      district: court.district,
      date,
      time,
      description,
    };

    try {
      const response = await fetch("http://localhost:5000/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(match),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Maç oluşturulamadı");
        return;
      }

      setCreatedMatch(data);
      setMessage("");

      console.log("Match Created:");
      console.log(data);
    } catch (error) {
      console.error("Match could not be created:", error);
      setMessage("Sunucuya bağlanılamadı");
    }
  };

  if (loading) {
    return (
      <div className="create-match-page">
        <p>Saha yükleniyor...</p>
      </div>
    );
  }

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

        {message && (
          <p className="create-match-message">
            {message}
          </p>
        )}

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
              <strong>Katılımcı Sayısı:</strong>{" "}
              {createdMatch.participants?.length || 0}
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