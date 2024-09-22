import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/RegisterPage.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from 'react-router-dom';

// Import gambar background
import BackgroundImage from "../assets/img/LoginPage/BackgroundLoginPage.jpg";

const RegisterPage = () => {
  return (
    <div className="login-container">
      <div className="content-wrapper">
        {/* Konten kiri untuk background image */}
        <div className="left-content">
          <img src={BackgroundImage} alt="Background" className="background-image" />
          <div className="logo">Your Logo</div>
        </div>

        {/* Form register di sebelah kanan */}
        <div className="right-content">
          <form>
            <h2>Sign up</h2>
            <p>
              If you already have an account register<br />
              you can <Link to="/login">Login here!</Link>
            </p>
            <div className="input-box">
              <input type="text" placeholder="Enter your email address" required />
              <i className="bi bi-envelope icon"></i>
            </div>
            <div className="input-box">
              <input type="text" placeholder="Enter your User name" required />
              <i className="bi bi-person icon"></i>
            </div>
            <div className="input-box">
              <input type="password" placeholder="Enter your Password" required />
              <i className="bi bi-lock-fill icon"></i>
            </div>
            <div className="input-box">
              <input type="password" placeholder="Confirm your Password" required />
              <i className="bi bi-lock-fill icon"></i>
            </div>

            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
