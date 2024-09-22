import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/LoginPage.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom';

// Import gambar background
import BackgroundImage from "../assets/img/LoginPage/BackgroundLoginPage.jpg";

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="content-wrapper">
        {/* Konten kiri untuk background image */}
        <div className="left-content">
          <img src={BackgroundImage} alt="Background" className="background-image" />
          <div className="logo">Your Logo</div>
        </div>

        {/* Form login di sebelah kanan */}
        <div className="right-content">
          <form>
            <h2>Sign in</h2>
            <p>
              If you don’t have an account register<br />
              you can <Link to="/register">Register here!</Link>
            </p>
            <div className="input-box">
              <input type="text" placeholder="Enter your email address" required />
              <i className="bi bi-envelope icon"></i>
            </div>
            <div className="input-box">
              <input type="password" placeholder="Enter your Password" required />
              <i className="bi bi-lock-fill icon"></i>
            </div>

            <div className="remember-forgot">
              <label>
                <input type="checkbox" />
                Remember me
              </label>
              <a href="/forgotPassword">Forgot Password?</a>
            </div>

            <button type="submit">Login</button>

            <div className="social-login">
              <p>or continue with</p>
              <div className="social-buttons">
                <button className="btn social-btn">
                  <i className="bi bi-facebook"></i>
                </button>
                <button className="btn social-btn">
                  <FcGoogle />
                </button>
                <button className="btn social-btn">
                  <i className="bi bi-apple"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
