import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MatchDetail.css";

const MatchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [locationLoading, setLocationLoading] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    fetch("http://localhost:5000/matches")
      .then((response) => response.json())
      .then((data) => {
        const foundMatch = data.find(
          (matchItem) => matchItem._id === id
        );

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
      (participantId) =>
        participantId.toString() === user.id
    );

  const hasVerifiedLocation =
    match &&
    user &&
    match.locationVerifications?.some(
      (verification) =>
        verification.user?.toString() === user.id
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

  const handleVerifyLocation = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage(
        "Konumunu doğrulamak için giriş yapmalısın."
      );
      return;
    }

    if (!navigator.geolocation) {
      setMessage(
        "Tarayıcın konum doğrulamasını desteklemiyor."
      );
      return;
    }

    setLocationLoading(true);
    setMessage("Konumun alınıyor...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `http://localhost:5000/matches/${id}/verify-location`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            setMessage(
              data.message || "Konum doğrulanamadı."
            );
            return;
          }

          setMessage(data.message);

          // Backend doğrulamayı Match üzerinde kaydetti.
          // Sayfayı tamamen yenilemeden local state'i de
          // güncelliyoruz.
          setMatch((currentMatch) => ({
            ...currentMatch,
            locationVerifications: [
              ...(currentMatch.locationVerifications || []),
              {
                user: user.id,
                verifiedAt: data.verifiedAt,
              },
            ],
          }));

          // localStorage içindeki kullanıcı puanını da güncelle.
          // Böylece kullanıcı verisini kullanan diğer frontend
          // bölümleri eski rank puanını göstermesin.
          if (
            user &&
            typeof data.rankPoints === "number"
          ) {
            const updatedUser = {
              ...user,
              rankPoints: data.rankPoints,
            };

            localStorage.setItem(
              "user",
              JSON.stringify(updatedUser)
            );

            window.dispatchEvent(
              new Event("authChanged")
            );
          }
        } catch (error) {
          console.error(
            "Location verification error:",
            error
          );

          setMessage("Sunucuya bağlanılamadı.");
        } finally {
          setLocationLoading(false);
        }
      },

      (error) => {
        console.error("Geolocation error:", error);

        if (error.code === error.PERMISSION_DENIED) {
          setMessage(
            "Konum izni verilmedi. Doğrulama yapabilmek için tarayıcıdan konum izni vermelisin."
          );
        } else if (
          error.code === error.POSITION_UNAVAILABLE
        ) {
          setMessage(
            "Konum bilgisi şu anda alınamıyor."
          );
        } else if (error.code === error.TIMEOUT) {
          setMessage(
            "Konum alınırken zaman aşımı oluştu. Tekrar deneyebilirsin."
          );
        } else {
          setMessage("Konum bilgisi alınamadı.");
        }

        setLocationLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
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
        <h1 className="match-detail-title">
          {match.courtName}
        </h1>

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
          {user && isJoined && (
            <>
              {hasVerifiedLocation ? (
                <p>
                  ✅ Bu maç için konumun doğrulandı.
                </p>
              ) : (
                <button
                  onClick={handleVerifyLocation}
                  disabled={locationLoading}
                >
                  {locationLoading
                    ? "Konum Alınıyor..."
                    : "📍 Konumumu Doğrula"}
                </button>
              )}
            </>
          )}

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