import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/LoginPage.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BackgroundImage from "../assets/img/LoginPage/BackgroundLoginPage.jpg";
import { Navbar } from "react-bootstrap";

const LoginPage = ({ setIsAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      setIsAuth(true);
      navigate("/home");
    }
  }, [navigate, setIsAuth]);

  // Lazy load untuk gambar
  useEffect(() => {
    const img = new Image();
    img.src = BackgroundImage;
    img.onload = () => setIsImageLoaded(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/user/login",
        { email, password }
      );

      console.log("Response dari backend:", response.data);

      // Simpan data autentikasi di localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", response.data.role);

      if (response.data.userId) {
        localStorage.setItem("userId", response.data.userId);
        console.log("User ID saved to localStorage:", response.data.userId);
      } else {
        console.error("User ID tidak ditemukan dalam respons.");
      }

      setIsAuth(true);

      // Redirect berdasarkan peran pengguna
      if (response.data.role === "admin") {
        navigate("/cms/users");
      } else {
        navigate("/home");
      }
    } catch (err) {
      if (err.response) {
        console.log("Error dari backend:", err.response.data);

        if (
          err.response.status === 403 &&
          err.response.data.message === "Akun ini ditangguhkan."
        ) {
          setError(
            "Akun Anda telah di-suspend. Silakan hubungi admin untuk informasi lebih lanjut."
          );
        } else {
          setError("Login gagal, cek email atau password Anda.");
        }
      } else {
        console.error("Error yang tidak terduga:", err);
        setError("Terjadi kesalahan, coba lagi nanti.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk login dengan Google
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/admin/user/auth/google";
  };

  // Fungsi untuk toggle visibilitas password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            <div className="input-box">
              <input
                type="text"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <i className="bi bi-envelope icon"></i>
            </div>
            <div className="input-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
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

            {error && <p style={{ color: "red" }}>{error}</p>}

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
