import { useState, useEffect } from "react";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Form,
  DropdownButton,
  Dropdown,
  InputGroup,
  Button,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { navLinks } from "../data/dummyData";
// import "../styles/Navbar.css";

const NavbarComponent = () => {
  const [changeColor, setChangeColor] = useState(false);
  const changeBackgroundColor = () => {
    if (window.scrollY > 10) {
      setChangeColor(true);
    } else {
      setChangeColor(false);
    }
  };

  useEffect(() => {
    changeBackgroundColor();
    window.addEventListener("scroll", changeBackgroundColor);
    return () => window.removeEventListener("scroll", changeBackgroundColor);
  }, []);

  return (
    <div>
      <Navbar expand="lg" className={changeColor ? "color-active" : ""}>
        <Container>
          <Navbar.Brand href="#home" className="fw-bold">
            <img src="/logo.png" alt="Logo" style={{ height: "30px" }} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {navLinks.map((link) => (
                <div className="nav-link" key={link.id}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => (isActive ? "active" : "")}
                    end
                  >
                    {link.text}
                  </NavLink>
                </div>
              ))}
            </Nav>
            <div className="d-flex align-items-center ms-auto">
              <InputGroup className="search-group me-2">
                <DropdownButton
                  variant="outline-secondary"
                  title="All"
                  id="input-group-dropdown-1"
                  className="category-dropdown"
                >
                  <Dropdown.Item href="#">Action</Dropdown.Item>
                  <Dropdown.Item href="#">Another action</Dropdown.Item>
                  <Dropdown.Item href="#">Something else here</Dropdown.Item>
                  <Dropdown.Item href="#">Separated link</Dropdown.Item>
                </DropdownButton>
                <Form.Control
                  aria-label="Search"
                  placeholder="Enter Keywords?"
                  className="search-input"
                />
                <button className="search-button" type="button">
                  <i className="fa fa-search"></i>
                </button>
              </InputGroup>
              <NavDropdown
                title={<i className="fa fa-user-circle profile-icon"></i>}
                id="user-dropdown"
                align="end"
                className="profile-dropdown"
              >
                <NavDropdown.Item href="profile">Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
              </NavDropdown>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarComponent;
