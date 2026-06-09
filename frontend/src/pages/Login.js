import React from "react";
import "./Login.css";

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Giriş Yap</h1>

        <input
          type="text"
          placeholder="Kullanıcı Adı"
        />

        <input
          type="password"
          placeholder="Şifre"
        />

        <button>Giriş Yap</button>
      </div>
    </div>
  );
};

export default Login;