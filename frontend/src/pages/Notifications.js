import React, { useCallback, useEffect, useState } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const [showMuteOptions, setShowMuteOptions] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const [mutedUntil, setMutedUntil] = useState(null);

  const token = localStorage.getItem("token");

  const loadNotifications = useCallback(async () => {
    if (!token) {
      setMessage("Bildirimlerini görmek için giriş yapmalısın.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Bildirimler alınamadı");
        return;
      }

      setNotifications(data);
    } catch (error) {
      console.error("Notifications error:", error);
      setMessage("Sunucuya bağlanılamadı");
    }
  }, [token]);

  const loadNotificationSettings = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/notifications/settings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Bildirim ayarları alınamadı"
        );
        return;
      }

      setIsMuted(data.isMuted);
      setMutedUntil(data.notificationsMutedUntil);
    } catch (error) {
      console.error(
        "Notification settings error:",
        error
      );

      setMessage("Bildirim ayarları alınamadı");
    }
  }, [token]);

  useEffect(() => {
    loadNotifications();
    loadNotificationSettings();
  }, [loadNotifications, loadNotificationSettings]);

  const handleAccept = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/notifications/${notificationId}/accept`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Bildirim kabul edilemedi");
        return;
      }

      setMessage(data.message);

      await loadNotifications();

      window.dispatchEvent(
        new Event("notificationsChanged")
      );
    } catch (error) {
      console.error("Accept notification error:", error);
      setMessage("Sunucuya bağlanılamadı");
    }
  };

  const handleReject = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/notifications/${notificationId}/reject`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Bildirim reddedilemedi");
        return;
      }

      setMessage(data.message);

      await loadNotifications();

      window.dispatchEvent(
        new Event("notificationsChanged")
      );
    } catch (error) {
      console.error("Reject notification error:", error);
      setMessage("Sunucuya bağlanılamadı");
    }
  };

  const handleMute = async (duration) => {
    try {
      const response = await fetch(
        "http://localhost:5000/notifications/mute",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            duration,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Bildirimler sessize alınamadı"
        );
        return;
      }

      const durationLabels = {
        "1h": "1 saat",
        "6h": "6 saat",
        "12h": "12 saat",
        "1d": "1 gün",
      };

      setMessage(
        `Bildirimler ${durationLabels[duration]} boyunca sessize alındı.`
      );

      setIsMuted(true);
      setMutedUntil(data.notificationsMutedUntil);
      setShowMuteOptions(false);
    } catch (error) {
      console.error("Mute notifications error:", error);
      setMessage("Sunucuya bağlanılamadı");
    }
  };

  const handleUnmute = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/notifications/unmute",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Bildirimlerin sesi açılamadı"
        );
        return;
      }

      setIsMuted(false);
      setMutedUntil(null);
      setShowMuteOptions(false);
      setMessage(data.message);
    } catch (error) {
      console.error("Unmute notifications error:", error);
      setMessage("Sunucuya bağlanılamadı");
    }
  };

  const formatMutedUntil = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <h1>Bildirimler</h1>

      {isMuted ? (
        <div>
          <p>
            🔕 <strong>Bildirimler şu anda sessizde.</strong>
          </p>

          {mutedUntil && (
            <p>
              Sessiz bitişi: {formatMutedUntil(mutedUntil)}
            </p>
          )}

          <button onClick={handleUnmute}>
            🔔 Sessizi Kaldır
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={() =>
              setShowMuteOptions((current) => !current)
            }
          >
            🔕 Bildirimleri Sessize Al
          </button>

          {showMuteOptions && (
            <div>
              <p>
                Ne kadar süre sessize almak istiyorsun?
              </p>

              <button onClick={() => handleMute("1h")}>
                1 Saat
              </button>

              <button onClick={() => handleMute("6h")}>
                6 Saat
              </button>

              <button onClick={() => handleMute("12h")}>
                12 Saat
              </button>

              <button onClick={() => handleMute("1d")}>
                1 Gün
              </button>
            </div>
          )}
        </>
      )}

      {message && <p>{message}</p>}

      {notifications.length === 0 && !message && (
        <p>Henüz bildirimin yok.</p>
      )}

      {notifications.map((notification) => (
        <div key={notification._id}>
          <p>
            <strong>
              {notification.sender?.username || "Bir kullanıcı"}
            </strong>{" "}
            favorilediğin{" "}
            <strong>
              {notification.court?.name || "sahada"}
            </strong>{" "}
            yeni bir maç oluşturdu.
          </p>

          {notification.match && (
            <p>
              {notification.match.date} -{" "}
              {notification.match.time}
            </p>
          )}

          <p>Durum: {notification.status}</p>

          {notification.status === "pending" && (
            <>
              <button
                onClick={() =>
                  handleAccept(notification._id)
                }
              >
                Kabul Et
              </button>

              <button
                onClick={() =>
                  handleReject(notification._id)
                }
              >
                Reddet
              </button>
            </>
          )}

          <hr />
        </div>
      ))}
    </div>
  );
};

export default Notifications;