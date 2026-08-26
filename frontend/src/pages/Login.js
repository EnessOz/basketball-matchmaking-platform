import React, { useState } from "react";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Giriş başarısız");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Giriş başarılı");

      console.log("Logged in user:", data.user);
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Sunucuya bağlanılamadı");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Giriş Yap</h1>

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

        <button onClick={handleLogin}>
          Giriş Yap
        </button>

        {message && (
          <p className="login-message">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;