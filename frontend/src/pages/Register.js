import React, { useState } from "react";
import "./Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [message, setMessage] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const handleRegister = async () => {
    if (password !== passwordAgain) {
      setMessage("Şifreler eşleşmiyor");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Kayıt başarısız");
        return;
      }

      setMessage("Kayıt başarılı");

      setUsername("");
      setEmail("");
      setPassword("");
      setPasswordAgain("");
    } catch (error) {
      console.error("Register error:", error);
      setMessage("Sunucuya bağlanılamadı");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChanged"));

    setIsLoggedIn(false);
    setMessage("");
  };

  if (isLoggedIn) {
    return (
      <div className="register-container">
        <div className="register-card">
          <h1>Kayıt Ol</h1>

          <p className="register-message">
            Yeni bir hesap oluşturmak için önce mevcut hesabından çıkış yapmalısın.
          </p>

          <button onClick={handleLogout}>
            Çıkış Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Kayıt Ol</h1>

        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Şifre Tekrar"
          value={passwordAgain}
          onChange={(e) => setPasswordAgain(e.target.value)}
        />

        <button onClick={handleRegister}>
          Kayıt Ol
        </button>

        {message && (
          <p className="register-message">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;