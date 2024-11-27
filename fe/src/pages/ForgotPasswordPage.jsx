import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ForgotPasswordPage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import BackgroundImage from "../assets/img/LoginPage/BackgroundLoginPage.jpg";
import { Navbar } from "react-bootstrap";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/admin/user/forgotPassword", { email });
      setMessage(response.data.message);
      setError(null);
    } catch (err) {
      setError("Gagal mengirim link reset password.");
      setMessage(null);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="content-wrapper">
        <div className="left-content">
          <img src={BackgroundImage} alt="Background" className="background-image" />
          <Navbar.Brand
            className="Logo"
            style={{
              position: "absolute",
              zIndex: 999,
              top: "20px",
              left: "10px",
            }}
          >
            <img src="/logo.png" alt="Logo" style={{ height: "30px" }} />
          </Navbar.Brand>
        </div>

        <div className="right-content">
          <form onSubmit={handleSubmit}>
            <h2>Forgot Password</h2>
            <p>Enter your email address and we'll send you a link to reset your password.</p>
            <div className="input-box">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="reset-btn">Send Reset Link</button>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
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
