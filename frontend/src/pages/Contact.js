import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>İletişim</h1>

        <p>
          Proje ile ilgili görüş, öneri veya hata bildirimleri için aşağıdaki
          iletişim bilgilerini kullanabilirsiniz.
        </p>

        <div className="contact-card">
          <h2>E-posta</h2>
          <p>contact@courtmatch.com</p>
        </div>

        <div className="contact-card">
          <h2>GitHub</h2>
          <p>github.com/EnessOz</p>
        </div>

        <div className="contact-card">
          <h2>Konum</h2>
          <p>Samsun, Türkiye</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;