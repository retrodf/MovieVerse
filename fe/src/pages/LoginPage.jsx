import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/LoginPage.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BackgroundImage from "../assets/img/LoginPage/BackgroundLoginPage.jpg";
import { Navbar, OverlayTrigger, Popover } from "react-bootstrap";

const LoginPage = ({ setIsAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   console.log("Query Params from URL:", window.location.search); // Debug query params
  //   const token = urlParams.get("token");
  //   if (token) {
  //     console.log("Token received from Google Login:", token); // Debug token
  //     localStorage.setItem("token", token);
  //     setIsAuth(true);
  //     navigate("/home");
  //   } else {
  //     console.error("No token received from Google login");
  //   }
  // }, [navigate, setIsAuth]);   
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token'); // Ambil token dari URL
  
    if (token) {
      console.log('Token received from Google login:', token); // Debug token yang diterima
      localStorage.setItem('token', token); // Simpan token di localStorage
      setIsAuth(true); // Tandai user telah login
      navigate("/home"); // Redirect ke halaman utama setelah login
    } else {
      console.error('No token received from Google login');
    }
  }, [navigate, setIsAuth]);  

  // Lazy load untuk gambar
  useEffect(() => {
    const img = new Image();
    img.src = BackgroundImage;
    img.onload = () => setIsImageLoaded(true);
  }, []);

  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/.test(password);

  const validateField = (field, value) => {
    if (!value) {
      return `${field} is required.`;
    }
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address.";
    }
    if (field === "password" && !isValidPassword(value)) {
      return "Password must be at least 6 characters long, contain uppercase, lowercase, a number, and a special character.";
    }
    return null;
  };

  const handleBlur = (field, value) => {
    setError((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {
      email: validateField("email", email),
      password: validateField("password", password),
    };

    if (Object.values(errors).some((err) => err !== null)) {
      setError(errors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/user/login",
        { email, password }
      );

      // Save authentication data to localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", response.data.role);

      setIsAuth(true);

      // Redirect user based on role
      if (response.data.role === "admin") {
        navigate("/cms/users");
      } else {
        navigate("/home");
      }
    } catch (err) {
      if (err.response) {
        setError({
          general:
            err.response.data.message || "Login failed, please try again.",
        });
      } else {
        setError({ general: "Unexpected error, please try again later." });
      }
    } finally {
      setIsLoading(false);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/admin/user/auth/google";
  };  

  return (
    <div className="login-container">
      <div className="content-wrapper">
        <div className="left-content">
          {isImageLoaded && (
            <img
              src={BackgroundImage}
              alt="Background"
              className="background-image"
            />
          )}
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

        {/* Form login */}
        <div className="right-content">
          <form onSubmit={handleSubmit}>
            <h2>Sign in</h2>
            <p>
              If you don’t have an account register
              <br />
              you can <Link to="/register">Register here!</Link>
            </p>
            {["email", "password"].map((field, idx) => (
              <OverlayTrigger
                key={idx}
                placement="bottom"
                overlay={error[field] ? renderTooltip(error[field]) : <></>}
                show={!!error[field]}
              >
                <div className={`input-box ${error[field] ? "input-error" : ""}`}>
                  <input
                    type={
                      field === "password" ? (showPassword ? "text" : "password") : "text"
                    }
                    placeholder={`Enter your ${field}`}
                    value={field === "email" ? email : password}
                    onChange={(e) =>
                      field === "email" ? setEmail(e.target.value) : setPassword(e.target.value)
                    }
                    onBlur={(e) => handleBlur(field, e.target.value)}
                    required
                  />
                  <i
                    className={`bi ${
                      field === "password"
                        ? showPassword
                          ? "bi-eye-slash"
                          : "bi-eye"
                        : "bi-envelope"
                    } icon`}
                    onClick={field === "password" ? togglePasswordVisibility : null}
                    style={{ cursor: field === "password" ? "pointer" : "default" }}
                  ></i>
                </div>
              </OverlayTrigger>
            ))}

            {error.general && <p style={{ color: "red" }}>{error.general}</p>}

            <div className="remember-forgot">
              <a href="/forgotPassword">Forgot Password?</a>
            </div>
            <button className="login-btn" type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </button>

            <div className="social-login">
              <p>or continue with</p>
              <div className="social-buttons">
                <button className="google-btn" onClick={handleGoogleLogin}>
                  <FcGoogle />
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
