import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ForgotPasswordPage.css";
import BackgroundImage from "../assets/img/LoginPage/BackgroundLoginPage.jpg";
import { Navbar, OverlayTrigger, Popover } from "react-bootstrap";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({});
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/.test(
      password
    );

  const validateField = (field, value) => {
    if (!value) {
      return `${field} is required.`;
    }
    if (field === "password" && !isValidPassword(value)) {
      return "Password must be at least 6 characters long, contain uppercase, lowercase, a number, and a special character.";
    }
    if (field === "confirmPassword" && value !== password) {
      return "Passwords do not match.";
    }
    return null;
  };

  const handleBlur = (field, value) => {
    setError((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Token yang dikirim:", token); // Log token dari URL
  
    try {
      const response = await axios.post(
        `http://localhost:3000/api/admin/user/resetPassword/${token}`,
        { password },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Response berhasil:", response.data);
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Error response:", err.response?.data || err.message);
      setError({
        general: err.response?.data?.message || "Failed to reset password.",
      });
    }
  };
      
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
            <h2>Reset Password</h2>
            <p>Enter your new password below to reset it.</p>

            {/* Password Field */}
            <OverlayTrigger
              placement="bottom"
              overlay={error.password ? renderTooltip(error.password) : <></>}
              show={!!error.password}
            >
              <div
                className={`input-box ${error.password ? "input-error" : ""}`}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={(e) => handleBlur("password", e.target.value)}
                  required
                />
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} icon`}
                  onClick={togglePasswordVisibility}
                  style={{ cursor: "pointer" }}
                ></i>
              </div>
            </OverlayTrigger>

            {/* Confirm Password Field */}
            <OverlayTrigger
              placement="bottom"
              overlay={
                error.confirmPassword ? (
                  renderTooltip(error.confirmPassword)
                ) : (
                  <></>
                )
              }
              show={!!error.confirmPassword}
            >
              <div
                className={`input-box ${error.confirmPassword ? "input-error" : ""}`}
              >
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={(e) => handleBlur("confirmPassword", e.target.value)}
                  required
                />
                <i
                  className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"} icon`}
                  onClick={toggleConfirmPasswordVisibility}
                  style={{ cursor: "pointer" }}
                ></i>
              </div>
            </OverlayTrigger>

            {message && <p className="success-message">{message}</p>}
            {error.general && <p className="error-message">{error.general}</p>}

            <button type="submit" className="btn-reset">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
