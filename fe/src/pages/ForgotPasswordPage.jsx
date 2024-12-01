import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ForgotPasswordPage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import BackgroundImage from "../assets/img/LoginPage/BackgroundLoginPage.jpg";
import { Navbar, OverlayTrigger, Popover } from "react-bootstrap";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState({});

  // Validasi format email
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateField = (field, value) => {
    if (!value) {
      return `${field} is required.`;
    }
    if (field === "email" && !isValidEmail(value)) {
      return "Invalid email format. Please include a valid '@' in the email address.";
    }
    return null;
  };

  const handleBlur = (field, value) => {
    setError((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = { email: validateField("email", email) };

    if (Object.values(errors).some((err) => err !== null)) {
      setError(errors);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/user/forgotPassword",
        { email }
      );
      setMessage(response.data.message); // Tampilkan pesan sukses
      setError({});
    } catch (err) {
      setError({
        general:
          err.response?.data?.message || "Failed to send password reset link.",
      });
      setMessage(null);
    }
  };

  // Tooltip untuk pesan error
  const renderTooltip = (message) => (
    <Popover id="popover-basic" className="custom-popover">
      <Popover.Body>
        <i
          className="bi bi-exclamation-circle-fill me-2"
          style={{ color: "#dc3545" }}
        ></i>
        {message}
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="forgot-password-container">
      <div className="content-wrapper">
        <div className="left-content">
          <img
            src={BackgroundImage}
            alt="Background"
            className="background-image"
          />
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
            <p>
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            {/* Input email dengan validasi */}
            <OverlayTrigger
              placement="bottom"
              overlay={error.email ? renderTooltip(error.email) : <></>}
              show={!!error.email}
            >
              <div
                className={`input-box ${error.email ? "input-error" : ""}`}
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={(e) => handleBlur("email", e.target.value)}
                  required
                />
              </div>
            </OverlayTrigger>

            {/* Button Kirim */}
            <button type="submit" className="reset-btn">
              Send Reset Link
            </button>

            {/* Pesan Sukses/Error */}
            {message && <p className="success-message">{message}</p>}
            {error.general && <p className="error-message">{error.general}</p>}

            {/* Link kembali ke Login */}
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
