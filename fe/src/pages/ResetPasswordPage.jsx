import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ForgotPasswordPage.css";
import BackgroundImage from "../assets/img/LoginPage/BackgroundLoginPage.jpg";
import { Navbar } from "react-bootstrap";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State untuk show/hide confirm password
  const navigate = useNavigate();

  // Fungsi untuk toggle visibilitas password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/admin/user/resetPassword/${token}`,
        { password }
      );
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError("Failed to reset password.");
    }
  };

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
            <h2>Reset Password</h2>
            <p>Enter your new password below to reset it.</p>

            {/* New Password Field */}
            <div className="input-box">
              <input
                type={showPassword ? "text" : "password"} // Show/Hide password
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} icon`}
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer" }}
              ></i>
            </div>

            {/* Confirm Password Field */}
            <div className="input-box">
              <input
                type={showConfirmPassword ? "text" : "password"} // Show/Hide confirm password
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <i
                className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"} icon`}
                onClick={toggleConfirmPasswordVisibility}
                style={{ cursor: "pointer" }}
              ></i>
            </div>

            <button type="submit" className="btn-reset">
              Reset Password
            </button>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
