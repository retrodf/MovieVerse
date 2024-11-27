import { useState, useEffect } from "react";
import { Container, Row, Col, Carousel, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PopularMovies from "../components/PopularMovies";
import TopRatedMovies from "../components/TopMoviesComponent";
import { URL } from "../utils";
import "../styles/Navbar.css";

const HomePage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]); // Tambahkan state untuk genres
  let navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      const url = URL + "/movies/popular";
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setImages(data.slice(0, 5));
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await fetch(`${URL}/genres`); // Fetch genre dari backend
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setGenres(data.genres); // Simpan genre ke state
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchImages();
    fetchGenres(); // Fetch genre saat komponen dimount
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          Error: {error.message}. Please try again later.
        </Alert>
      </Container>
    );

  return (
    <div>
      <header
        className="w-100 min-vh-100 d-flex align-items-center"
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Carousel fade>
          {images.map((image) => (
            <Carousel.Item key={image.id}>
              <div
                style={{
                  backgroundImage: `url('${image.poster_url}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "100vh",
                  width: "100vw",
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center w-100 h-100"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)",
                  }}
                >
                  <Container>
                    <Row className="header-box d-flex align-items-center pt-lg-5">
                      <Col lg="6">
                        <h1 className="header-title mb-4 fw-bold">
                          {image.title || image.name}
                        </h1>
                        <Row className="mb-3">
                          <Col>
                            {/* Tampilkan genre yang terhubung dengan film (image.Genres) */}
                            {image.Genres?.map((genre) => (
                              <button
                                key={genre.id}
                                style={{ borderRadius: "50px" }}
                                className="btn btn-danger me-2"
                              >
                                {genre.name}
                              </button>
                            ))}
                          </Col>
                          <Col className="d-flex align-items-center">
                            <span className="text-warning fw-bold ms-3">
                              <i className="fa-solid fa-star"></i>{" "}
                              {image.rating}/10
                            </span>
                          </Col>
                        </Row>

                        <div className="synopsis-container">
                          <p className="synopsis-text">{image.synopsis}</p>
                        </div>
                        <button
                          className="btn btn-danger btn-lg rounded-1 me-2"
                          onClick={() => navigate(`/movie/${image.id}`)}
                        >
                          Watch Now
                        </button>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </header>

      {/* Movies & Series Section */}
      <Container className="mt-3">
        <div id="#movies" style={{ marginBottom: "50px" }}>
          <PopularMovies />
        </div>
        <div style={{ marginBottom: "50px" }}>
          <TopRatedMovies />
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
