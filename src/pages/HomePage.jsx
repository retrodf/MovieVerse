import { useState, useEffect } from "react";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PopularMovies from "../components/PopularMovies";
import PopularSeries from "../components/PopularSeries";
import { apiKey } from "../data";
import TopRatedMovies from "../components/TopMoviesComponent";
import TopRatedSeries from "../components/TopSeriesComponent";

const HomePage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setImages(data.results.slice(0, 5)); // Ambil hanya 5 gambar
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <header
        className="w-100 min-vh-100 d-flex align-items-center"
        style={{
          position: "relative",
          overflow: "hidden", // Prevent overflow
        }}
      >
        <Carousel fade>
          {images.map((image) => (
            <Carousel.Item key={image.id}>
              <div
                style={{
                  backgroundImage: `url('https://image.tmdb.org/t/p/original${image.backdrop_path}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "100vh",
                  width: "100vw", // Ensure full width
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
                        <h1 className="mb-4 fw-bold">
                          {image.title || image.name} <br />
                        </h1>
                        <Row className="mb-3">
                          <Col>
                            <button
                              style={{ borderRadius: "50px" }}
                              className="btn btn-danger me-2"
                            >
                              Animation
                            </button>
                            <button
                              style={{ borderRadius: "50px" }}
                              className="btn btn-danger"
                            >
                              Comedy
                            </button>
                          </Col>
                          <Col className="d-flex align-items-center">
                            <span className="text-warning fw-bold ms-3">
                              <i className="fa-solid fa-star"></i> 4.5/5
                            </span>
                          </Col>
                        </Row>
                        <p className="mb-4">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Voluptatem nihil voluptates possimus debitis,
                          veniam ex?
                        </p>
                        <button
                          className="btn btn-danger btn-lg rounded-1 me-2"
                          onClick={() => navigate("/kelas")}
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
      {/* <Container className="mt-3">
        <div id="#movies">
          <PopularMovies />
        </div>
        <div>
          <PopularSeries />
        </div>
        <div>
          <TopRatedMovies />
        </div>
        <div>
          <TopRatedSeries />
        </div>
      </Container> */}
      <Container className="mt-3">
        <div id="#movies" style={{ marginBottom: "50px" }}>
          <PopularMovies />
        </div>
        <div style={{ marginBottom: "50px" }}>
          <PopularSeries />
        </div>
        <div style={{ marginBottom: "50px" }}>
          <TopRatedMovies />
        </div>
        <div style={{ marginBottom: "50px" }}>
          <TopRatedSeries />
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
