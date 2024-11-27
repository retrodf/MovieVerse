import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/RegisterPage.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BackgroundImage from "../assets/img/LoginPage/BackgroundLoginPage.jpg";
import { Navbar } from "react-bootstrap";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidUsername = (username) => /^[a-zA-Z0-9_]{3,15}$/.test(username);

  const isValidName = (name) =>
    name.trim().length >= 2 && name.trim().length <= 50;

  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "name":
        if (!isValidName(value))
          error = "Name must be between 2 and 50 characters.";
        break;
      case "username":
        if (!isValidUsername(value))
          error =
            "Username must be 3-15 characters and can only contain letters, numbers, and underscores.";
        break;
      case "email":
        if (!isValidEmail(value)) error = "Invalid email address.";
        break;
      case "password":
        if (!isValidPassword(value))
          error =
            "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.";
        break;
      case "confirmPassword":
        if (value !== password) error = "Passwords do not match.";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const handleBlur = (field, value) => {
    validateField(field, value);
    setTouched((prevTouched) => ({ ...prevTouched, [field]: true }));
  };

  const handleChange = (field, value) => {
    switch (field) {
      case "name":
        setName(value);
        break;
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }
    if (touched[field]) validateField(field, value); // Update validation only if field is already touched
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there are still validation errors
    if (Object.values(errors).some((error) => error)) {
      setMessage("Please fix the errors before submitting.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/user/register",
        {
          name,
          email,
          username,
          password,
          role: "user",
        }
      );

      if (response.data.success) {
        setMessage(
          "Registration successful! Please check your email for verification."
        );
      } else {
        setMessage(
          "Registration successful, but there was an issue with email verification."
        );
      }

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setErrors({
        global:
          err.response?.data?.message ||
          "Registration failed, please try again.",
      });
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="login-container">
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
            <h2>Sign up</h2>
            <p>
              If you already have an account, you can{" "}
              <Link to="/login">Login here!</Link>
            </p>

            <div className="input-box">
              <input
                type="text"
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={(e) => handleBlur("name", e.target.value)}
                className={errors.name && touched.name ? "error-border" : ""}
              />
              <i className="bi bi-person icon"></i>
              {errors.name && touched.name && (
                <p className="error-text">{errors.name}</p>
              )}
            </div>

            <div className="input-box">
              <input
                type="text"
                placeholder="Enter your Username"
                value={username}
                onChange={(e) => handleChange("username", e.target.value)}
                onBlur={(e) => handleBlur("username", e.target.value)}
                className={
                  errors.username && touched.username ? "error-border" : ""
                }
              />
              <i className="bi bi-person icon"></i>
              {errors.username && touched.username && (
                <p className="error-text">{errors.username}</p>
              )}
            </div>

            <div className="input-box">
              <input
                type="email"
                placeholder="Enter your Email Address"
                value={email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={(e) => handleBlur("email", e.target.value)}
                className={errors.email && touched.email ? "error-border" : ""}
              />
              <i className="bi bi-envelope icon"></i>
              {errors.email && touched.email && (
                <p className="error-text">{errors.email}</p>
              )}
            </div>

            <div className="input-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={(e) => handleBlur("password", e.target.value)}
                className={
                  errors.password && touched.password ? "error-border" : ""
                }
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} icon`}
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer" }}
              ></i>
              {errors.password && touched.password && (
                <p className="error-text">{errors.password}</p>
              )}
            </div>

            <div className="input-box">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your Password"
                value={confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                onBlur={(e) => handleBlur("confirmPassword", e.target.value)}
                className={
                  errors.confirmPassword && touched.confirmPassword
                    ? "error-border"
                    : ""
                }
              />
              <i
                className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"} icon`}
                onClick={toggleConfirmPasswordVisibility}
                style={{ cursor: "pointer" }}
              ></i>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="error-text">{errors.confirmPassword}</p>
              )}
            </div>

            {message && <p className="success-text">{message}</p>}

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
