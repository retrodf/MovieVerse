import { useState, useEffect } from "react";
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { navLinks } from "../data/dummyData";
import "../styles/NavbarPage.css";

const NavbarComponent = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [changeColor, setChangeColor] = useState(false);
  const navigate = useNavigate();

  // Cek apakah token JWT ada di localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, []);

  // Fungsi untuk logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    navigate("/login");
  };

  // Mengubah warna navbar saat scroll
  const changeBackgroundColor = () => {
    if (window.scrollY > 10) {
      setChangeColor(true);
    } else {
      setChangeColor(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackgroundColor);
    return () => window.removeEventListener("scroll", changeBackgroundColor);
  }, []);

  // Fungsi navigasi ke halaman Add Movie
  const handleAddMovie = () => {
    navigate("/movies/add");
  };

  return (
    <div>
      <Navbar expand="lg" className={changeColor ? "navbar-active" : ""}>
        <Container
          fluid
          className="d-flex justify-content-between align-items-center"
        >
          <Navbar.Brand href="/" className="fw-bold">
            <img src="/logo.png" alt="Logo" className="logo-img" />
          </Navbar.Brand>

          <Nav className="me-auto d-flex align-items-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.id}
                to={link.path}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {link.text}
              </NavLink>
            ))}
          </Nav>

          <div className="d-flex align-items-center">
            {isAuth ? (
              <NavDropdown
                title={<i className="fa fa-user-circle profile-icon"></i>}
                id="user-dropdown"
                align="end"
                className="profile-dropdown"
              >
                <NavDropdown.Item onClick={handleAddMovie}>
                  Add New Movie
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavLink to="/login" className="nav-link">
                <Button className="login-btn-navbar">SIGN IN</Button>
              </NavLink>
            )}
          </div>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarComponent;
