import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { navLinks } from "../data/dummyData";

const FooterComponent = () => {
  return (
    <div className="footer py-5 text-white">
      <Container>
        <Row className="d-flex justify-content-between">
          <Col lg="5">
            <h3 className="fw-bold">MovieVerse</h3>
            <p className="desc">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsum
              esse deserunt nesciunt, quod qui dignissimos officia earum alias
              cum vitae.
            </p>
            <div className="no mb-1 mt-4 text-white">
              <Link className="text-decoration-none">
                <i className="fa-brands fa-whatsapp"></i>
                <p className="m-0 text-white">+62 123-456-789</p>
              </Link>
            </div>
            <div className="mail">
              <Link className="text-decoration-none">
                <i className="fa-regular fa-envelope"></i>
                <p className="m-0 text-white">person-email@gmail.com</p>
              </Link>
            </div>
          </Col>
          <Col className="d-flex flex-column col-lg-2 col mt-lg-0 mt-5">
            <h5 className="fw-bold">Menu</h5>
            {navLinks.map((element) => (
              <Link key={element.path} to={element.path} className="nav-link">
                {element.text}
              </Link>
            ))}
          </Col>
          <Col lg="5" className="mt-lg-0 mt-5">
            <Row>
              <Col lg="6">
                <h5 className="fw-bold mb-3">Follow Us</h5>
                <div className="social mt-3">
                  <i className="fa-brands fa-facebook"></i>
                  <i className="fa-brands fa-twitter"></i>
                  <i className="fa-brands fa-linkedin"></i>
                  <i className="fa-brands fa-youtube"></i>
                </div>
              </Col>
              <Col lg="6">
                <h5 className="fw-bold mb-3">MovieVerse App</h5>
                <div className="d-flex align-items-center mt-3">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/51/Download_on_the_App_Store_Badge_US-UK_RGB_blk.svg"
                    alt="App Store"
                    style={{ width: "120px", marginRight: "10px" }}
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Google Play Store"
                    style={{ width: "140px" }}
                  />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <p className="text-center px-md-0 px-3">
              &copy; Copyright {new Date().getFullYear()} by{" "}
              <span className="fw-bold">MovieVerse Team</span> , All Right
              Reserved
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FooterComponent;
