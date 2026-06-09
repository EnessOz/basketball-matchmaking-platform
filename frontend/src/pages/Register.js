import React from "react";
import "./Register.css";

const Register = () => {
  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Kayıt Ol</h1>

        <input
          type="text"
          placeholder="Kullanıcı Adı"
        />

        <input
          type="email"
          placeholder="E-posta"
        />

        <input
          type="password"
          placeholder="Şifre"
        />

        <input
          type="password"
          placeholder="Şifre Tekrar"
        />

        <button>Kayıt Ol</button>
      </div>
    </div>
  );
};

export default Register;