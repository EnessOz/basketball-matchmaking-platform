import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./CourtDetail.css";

const CourtDetail = () => {
  const { id } = useParams();

  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("");

  const token = localStorage.getItem("token");

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

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/users/favorites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const favoriteExists = data.some(
          (favoriteCourt) => favoriteCourt._id === id
        );

        setIsFavorite(favoriteExists);
      })
      .catch((error) => {
        console.error("Favorite courts could not be loaded:", error);
      });
  }, [id, token]);

  const handleFavorite = async () => {
    if (!token) {
      setFavoriteMessage("Favorilere eklemek için giriş yapmalısın.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/users/favorites/${id}`,
        {
          method: isFavorite ? "DELETE" : "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setFavoriteMessage(
          data.message || "Favori işlemi gerçekleştirilemedi."
        );
        return;
      }

      setIsFavorite(!isFavorite);
      setFavoriteMessage(
        isFavorite
          ? "Saha favorilerden çıkarıldı."
          : "Saha favorilere eklendi."
      );
    } catch (error) {
      console.error("Favorite action failed:", error);
      setFavoriteMessage("Sunucuya bağlanılamadı.");
    }
  };

  if (loading) {
    return (
      <div className="court-detail-page">
        <p>Saha yükleniyor...</p>
      </div>
    );
  }

  if (!court) {
    return (
      <div className="court-detail-page">
        <h1>Saha bulunamadı</h1>
        <p>Aradığın saha mevcut değil.</p>
      </div>
    );
  }

  const googleMapsUrl = `https://www.google.com/maps?q=${court.location.lat},${court.location.lng}`;

  return (
    <div className="court-detail-page">
      <div className="court-detail-container">
        <img
          className="court-detail-image"
          src={court.images[0]}
          alt={court.name}
        />

        <div className="court-detail-content">
          <h1 className="court-detail-title">{court.name}</h1>

          <p className="court-detail-location">
            {court.district} - {court.city}
          </p>

          <p className="court-detail-address">
            {court.location.address}
          </p>

          <div className="court-detail-info">
            <p>⭐ {court.rating}</p>
            <p>{court.features.lighting ? "Işıklı" : "Işıksız"}</p>
            <p>{court.features.indoor ? "Kapalı" : "Açık"}</p>
            <p>{court.features.rim_count} pota</p>
          </div>

          <div className="court-detail-tags">
            {court.tags.map((tag) => (
              <span key={tag} className="court-detail-tag">
                {tag}
              </span>
            ))}
          </div>

          {favoriteMessage && (
            <p className="court-favorite-message">
              {favoriteMessage}
            </p>
          )}

          <div className="court-detail-actions">
            <button
              className="court-detail-button"
              onClick={handleFavorite}
            >
              {isFavorite
                ? "Favorilerden Çıkar"
                : "Favorilere Ekle"}
            </button>

            <a
              className="court-detail-button"
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Google Maps'te Aç
            </a>

            <Link
              className="court-detail-button primary"
              to={`/courts/${court._id}/create-match`}
            >
              Bu Sahada Maç Oluştur
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtDetail;