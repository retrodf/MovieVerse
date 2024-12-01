import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Carousel,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { Link, useParams } from "react-router-dom";
import { URL } from "../utils";
import "../styles/MoviesPage.css";
import axios from "axios";

const MovieDetailPage = () => {
  const { id } = useParams();
  const [trailers, setTrailers] = useState([]);
  const [actors, setActors] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(3); // Jumlah ulasan yang ingin ditampilkan secara default
  const [newReview, setNewReview] = useState({
    username: "",
    rating: 0,
    content: "",
  });

  // Tambahkan state untuk director, genres, country dan countryList
  const [director, setDirector] = useState(null);
  const [genres, setGenres] = useState([]);
  const [country, setCountry] = useState("");
  const [countryList, setCountryList] = useState([]); // State untuk daftar country

  // State untuk login dan data pengguna
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(""); // Menyimpan username dari pengguna yang login

  // Mengambil data dari backend (fetch dari backend lokal)
  useEffect(() => {
    // Mengecek apakah pengguna sudah login
    const authToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    if (authToken && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername); // Simpan username
    } else {
      setIsLoggedIn(false);
      setUsername("");
    }

    const fetchMovieData = async () => {
      const movieUrl = `${URL}/movies/${id}`;

      try {
        const movieResponse = await fetch(movieUrl);
        const movieData = await movieResponse.json();

        // Fungsi untuk mengubah URL menjadi format embed YouTube
        const convertToEmbedUrl = (url) => {
          const match = url.match(
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([\w-]+)/
          );
          if (match) {
            return `https://www.youtube.com/embed/${match[1]}`;
          }
          console.warn("Invalid YouTube URL:", url);
          return url;
        };

        // Konversi URL MovieVideos
        setTrailers(
          movieData.movie.MovieVideos.map((video) => ({
            ...video,
            url: convertToEmbedUrl(video.url),
          }))
        );

        setMovie(movieData.movie);
        setActors(movieData.movie.Actors);
        setRecommendedMovies(movieData.recommendations);
        setDirector(movieData.movie.Director?.name || "-");
        setGenres(movieData.movie.Genres || []);
        setCountry(movieData.movie.countryId || "");
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    // Mengambil daftar negara dari backend
    const fetchCountryList = async () => {
      const countryUrl = `${URL}/countries`; // Sesuaikan dengan URL endpoint negara

      try {
        const countryResponse = await fetch(countryUrl);
        if (!countryResponse.ok) throw new Error("Failed to fetch countries");

        const countryData = await countryResponse.json();

        if (Array.isArray(countryData.countries)) {
          setCountryList(countryData.countries); // Simpan array negara ke state
        } else {
          console.error("Country data is not an array:", countryData);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchMovieData();
    fetchCountryList();
    fetchReviews(); // Panggil fetchReviews saat komponen pertama kali di-load
  }, [id]);

  // Mencari nama negara berdasarkan countryId
  const getCountryName = (countryId) => {
    const countryItem = countryList.find(
      (country) => country.countryId === countryId
    );
    return countryItem ? countryItem.name : "-";
  };

  const loadMoreReviews = () => {
    setVisibleReviews(visibleReviews + 3); // Menampilkan lebih banyak ulasan ketika tombol diklik
  };

  // Fungsi untuk mengambil ulasan dari backend
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${URL}/reviews/${id}`);
      console.log("Fetched reviews:", response.data); // Log untuk cek data
      const approvedReviews = response.data.filter(
        (review) => review.status === "Approved"
      ); // Filter hanya ulasan yang disetujui
      setReviews(approvedReviews); // Simpan ulasan yang sudah disetujui ke state
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!username) return;

    const parsedRating = parseFloat(newReview.rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 10) {
      alert("Please enter a valid rating between 1 and 10.");
      return;
    }

    const reviewData = {
      content: newReview.content,
      rating: parsedRating,
      movieId: id,
      userId: localStorage.getItem("userId"),
    };

    if (!reviewData.userId) {
      alert("User ID tidak ditemukan. Mohon login kembali.");
      return;
    }

    try {
      const response = await axios.post(`${URL}/reviews/add`, reviewData);
      console.log("Review added:", response.data);
      fetchReviews(); // Panggil fetchReviews setelah submit agar data ulasan diambil ulang
      setNewReview({ rating: 0, content: "" });
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Failed to add review. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          Error: {error.message || "Failed to load movie details"}
        </Alert>
      </Container>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <header
        className="w-100 min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#000",
          padding: "50px 0",
        }}
      >
        <Container className="mt-5">
          <Row className="d-flex justify-content-center">
            <Col lg={4} md={6} sm={12} className="text-center mb-4 mb-lg-0">
              {movie.poster_url ? (
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="img-fluid rounded shadow-lg"
                  loading="lazy"
                  style={{
                    maxHeight: "600px",
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
              ) : (
                <p>No Poster Available</p>
              )}
            </Col>
            <Col
              lg={8}
              md={12}
              className="text-white d-flex flex-column align-items-start"
            >
              <h1
                className="display-3 fw-bold"
                style={{
                  textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
                  marginBottom: "20px",
                  fontSize: "3rem",
                }}
              >
                {movie.title}{" "}
                {movie.release_date ? movie.release_date.split("-")[0] : ""}
              </h1>
              <div className="d-flex align-items-center mb-3 flex-wrap">
                <span
                  className="badge bg-success me-2"
                  style={{ fontSize: "1.2rem", marginBottom: "10px" }}
                >
                  {movie.rating}/10
                </span>
                {genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="badge bg-danger me-2"
                    style={{ fontSize: "1.2rem", marginBottom: "10px" }}
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              <p
                className="lead"
                style={{
                  lineHeight: "1.5",
                  marginBottom: "15px",
                  textAlign: "justify",
                }}
              >
                {movie.synopsis}
              </p>
              <div style={{ marginBottom: "4px", lineHeight: "2" }}>
                <strong>Director:</strong> {director}
              </div>
              <div style={{ marginBottom: "4px", lineHeight: "2" }}>
                <strong>Country:</strong> {getCountryName(movie.countryId)}
              </div>

              <div style={{ marginBottom: "4px", lineHeight: "2" }}>
                <strong>Release Date:</strong> {movie.release_date}
              </div>
              <Button variant="danger" className="btn-lg mt-3">
                Watch Now
              </Button>
            </Col>
          </Row>
        </Container>
      </header>

      {/* Trailer Section */}
      <Container className="mt-5">
        <h2 className="detail-movies-title">TRAILERS</h2>
        {trailers.length > 0 ? (
          <div className="carousel-wrapper">
            <Carousel
              className="trailer-carousel"
              prevIcon={
                <span
                  className="carousel-control-prev-icon custom-prev-icon"
                  aria-hidden="true"
                ></span>
              }
              nextIcon={
                <span
                  className="carousel-control-next-icon custom-next-icon"
                  aria-hidden="true"
                ></span>
              }
            >
              {trailers.map((trailer) => (
                <Carousel.Item key={trailer.id}>
                  <iframe
                    className="trailer-iframe"
                    src={trailer.url}
                    title={trailer.title || "Trailer"}
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: 0,
                    }}
                  ></iframe>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        ) : (
          <p className="text-white">No Trailers Available</p>
        )}
      </Container>

      {/* Cast Section */}
      <Container className="mt-5">
        <h3 className="detail-movies-title">CAST</h3>
        <Row>
          {actors.map((actor) => (
            <Col md={2} key={actor.id}>
              <div className="text-center">
                <Link to={`/celeb/${actor.id}`}>
                  <img
                    src={actor.image}
                    alt={actor.name}
                    className="img-fluid rounded"
                    loading="lazy"
                  />
                </Link>
                <Link to={`/celeb/${actor.id}`} className="actor-link">
                  <p className="mt-2">{actor.name}</p>
                </Link>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Recommended Movies Section */}
      <Container className="mt-5">
        <h3 className="detail-movies-title">RECOMMENDED MOVIES</h3>
        <div
          className="movie-list"
          style={{
            display: "flex",
            overflowX: "scroll",
            padding: "10px 0",
            gap: "10px",
            whiteSpace: "nowrap",
          }}
        >
          {recommendedMovies.map((movie) => (
            <div key={movie.id} className="movie-item">
              <Link to={`/movie/${movie.id}`}>
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="movie-poster"
                  loading="lazy"
                />
              </Link>
              <div className="movie-info">
                <h5>{movie.title}</h5>
                <p>{movie.release_date}</p>

                {/* Rating Circle */}
                <div className="rating-container">
                  <div
                    className="rating-circle"
                    style={{
                      border: `5px solid ${
                        movie.rating >= 7 ? "green" : "red"
                      }`,
                      borderColor: `conic-gradient(green ${
                        movie.rating * 10
                      }%, #ccc 0)`,
                    }}
                  >
                    <span className="rating-text">{movie.rating}</span>
                  </div>
                </div>

                {/* YouTube Search Icon */}
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                    movie.title
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="movie-info-icon"
                >
                  <FontAwesomeIcon color="#dc3545" icon={faYoutube} size="2x" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Reviews Section */}
      <Container className="mt-5 reviews-section">
        <h3 className="detail-movies-title">REVIEWS ({reviews.length}) </h3>
        {reviews.slice(0, visibleReviews).map((review) => (
          <div
            key={review.id}
            className="review-item d-flex mb-4"
            style={{ paddingBottom: "15px", paddingTop: "15px" }}
          >
            <div
              className="review-avatar d-flex align-items-center justify-content-center"
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "#ccc",
                borderRadius: "50%",
                marginRight: "15px",
                overflow: "hidden",
                flexShrink: "0",
              }}
            >
              <div
                className="text-white"
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  width: "100%",
                }}
              >
                {review.User?.username
                  ? review.User.username[0].toUpperCase()
                  : "U"}
              </div>
            </div>
            <div className="review-details flex-grow-1">
              <div className="d-flex justify-content-between align-items-center">
                <div className="review-author text-white fw-bold">
                  {review.User?.username || "Unknown Author"}
                </div>
                <div
                  className="review-date text-white"
                  style={{ fontSize: "0.85rem" }}
                >
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleString()
                    : "Unknown Date"}
                </div>
              </div>
              <div
                className="review-rating"
                style={{
                  color: "gold",
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ marginRight: "5px" }}>⭐</span>
                {review.rating}/10
              </div>
              <div
                className="review-text text-white"
                style={{
                  fontSize: "1rem",
                  lineHeight: "1.5",
                  wordBreak: "break-all",
                  overflowWrap: "break-word",
                }}
              >
                {review.content}
              </div>
            </div>
          </div>
        ))}

        {visibleReviews < reviews.length && (
          <button
            onClick={loadMoreReviews}
            className="btn btn-outline-light mt-3"
          >
            Load More
          </button>
        )}
      </Container>

      {/* Add Review Section */}
      {isLoggedIn ? (
        <Container className="mt-2">
          <h2 className="detail-movies-title">ADD YOUR REVIEW</h2>
          <Form onSubmit={handleAddReview}>
            <Form.Group className="text-white mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter your rating (1-10)"
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({ ...newReview, rating: e.target.value })
                }
                step="0.1"
                min="1"
                max="10"
                required
              />
            </Form.Group>
            <Form.Group className="text-white mb-3">
              <Form.Label>Your Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write your review here..."
                value={newReview.content}
                onChange={(e) =>
                  setNewReview({ ...newReview, content: e.target.value })
                }
                required
              />
            </Form.Group>
            <Button className="submit-review-btn" type="submit">
              Submit Review
            </Button>
          </Form>
        </Container>
      ) : (
        <p className="text-white mt-3" style={{ textAlign: "center" }}>
          Please log in to add a review.
        </p>
      )}
    </div>
  );
};

export default MovieDetailPage;
