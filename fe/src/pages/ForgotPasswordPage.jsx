import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ForgotPasswordPage.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from 'react-router-dom';

// Import gambar background
import BackgroundImage from "../assets/img/LoginPage/BackgroundLoginPage.jpg";

const ForgotPasswordPage = () => {
  return (
    <div className="forgot-password-container">
      <div className="content-wrapper">
        {/* Konten kiri untuk background image */}
        <div className="left-content">
          <img src={BackgroundImage} alt="Background" className="background-image" />
          <div className="logo">Your Logo</div>
        </div>

        {/* Form forgot password di sebelah kanan */}
        <div className="right-content">
          <form>
            <h2>Forgot Password</h2>
            <p>
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <div className="input-box">
              <input type="text" placeholder="Enter your email address" required />
              <i className="bi bi-envelope icon"></i>
            </div>

            <button type="submit">Send Reset Link</button>

            <div className="back-to-login">
              <Link to="/login">Back to Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
