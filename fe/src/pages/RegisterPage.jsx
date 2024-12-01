import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/RegisterPage.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BackgroundImage from "../assets/img/LoginPage/BackgroundLoginPage.jpg";
import { Navbar, OverlayTrigger, Popover } from "react-bootstrap";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState({});
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidUsername = (username) => /^[a-zA-Z0-9_]{3,15}$/.test(username);
  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/.test(password);

  const validateField = (field, value) => {
    if (!value) {
      return `${field} is required.`;
    }
    if (field === "name" && value.length < 3) {
      return "Name must be at least 3 characters long.";
    }
    if (field === "username" && !isValidUsername(value)) {
      return "Username must be 3-15 characters long and contain only letters, numbers, or underscores.";
    }
    if (field === "email" && !isValidEmail(value)) {
      return `Please include an '@' in the email address. '${value}' is missing an '@'.`;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {
      name: validateField("name", name),
      username: validateField("username", username),
      email: validateField("email", email),
      password: validateField("password", password),
      confirmPassword: validateField("confirmPassword", confirmPassword),
    };

    if (Object.values(errors).some((err) => err !== null)) {
      setError(errors);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/admin/user/register", {
        name,
        email,
        username,
        password,
        role: "user",
      });

      if (response.data.success) {
        setMessage("Registrasi berhasil! Silakan cek email Anda untuk verifikasi.");
      } else {
        setMessage("Registrasi berhasil, namun ada masalah dengan email verifikasi.");
      }
      setError({});

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      if (err.response?.data?.errors) {
        // Jika ada error validasi per field dari backend
        setError(err.response.data.errors);
      } else if (err.response?.data?.message) {
        // Jika ada pesan general error
        setError({ general: err.response.data.message });
      } else {
        // Jika tidak ada detail error dari backend
        setError({ general: "Register gagal, coba lagi." });
      }
    }
  };

  const renderTooltip = (message) => (
    <Popover id="popover-basic" className="custom-popover">
      <Popover.Body>
        <i className="bi bi-exclamation-circle-fill me-2" style={{ color: "#dc3545" }}></i>
        {message}
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="login-container">
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
            <h2>Sign up</h2>
            <p>
              If you already have an account, you can <Link to="/login">Login here!</Link>
            </p>
            {["name", "username", "email", "password", "confirmPassword"].map((field, idx) => (
              <OverlayTrigger
                key={idx}
                placement="bottom"
                overlay={error[field] ? renderTooltip(error[field]) : <></>}
                show={!!error[field]}
              >
                <div className={`input-box ${error[field] ? "input-error" : ""}`}>
                  <input
                    type={
                      field === "password" || field === "confirmPassword"
                        ? field === "password" && showPassword
                          ? "text"
                          : field === "confirmPassword" && showConfirmPassword
                          ? "text"
                          : "password"
                        : "text"
                    }
                    placeholder={`Enter your ${field}`}
                    value={
                      field === "name"
                        ? name
                        : field === "username"
                        ? username
                        : field === "email"
                        ? email
                        : field === "password"
                        ? password
                        : confirmPassword
                    }
                    onChange={(e) =>
                      field === "name"
                        ? setName(e.target.value)
                        : field === "username"
                        ? setUsername(e.target.value)
                        : field === "email"
                        ? setEmail(e.target.value)
                        : field === "password"
                        ? setPassword(e.target.value)
                        : setConfirmPassword(e.target.value)
                    }
                    onBlur={(e) => handleBlur(field, e.target.value)}
                    required
                  />
                  <i
                    className={`bi ${
                      field === "name" || field === "username" || field === "email"
                        ? field === "email"
                          ? "bi-envelope"
                          : "bi-person"
                        : field === "password"
                        ? showPassword
                          ? "bi-eye-slash"
                          : "bi-eye"
                        : showConfirmPassword
                        ? "bi-eye-slash"
                        : "bi-eye"
                    } icon`}
                    onClick={
                      field === "password"
                        ? () => setShowPassword(!showPassword)
                        : field === "confirmPassword"
                        ? () => setShowConfirmPassword(!showConfirmPassword)
                        : null
                    }
                    style={{ cursor: field === "password" || field === "confirmPassword" ? "pointer" : "default" }}
                  ></i>
                </div>
              </OverlayTrigger>
            ))}
            {error.general && <p style={{ color: "red" }}>{error.general}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}

            <button type="submit" className="register-btn">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
