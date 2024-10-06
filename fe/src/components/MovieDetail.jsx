import { useState, useEffect } from "react";
import { Container, Row, Col, Carousel, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { Link, useParams } from "react-router-dom";
import { apiKey } from "../data";

const MovieDetailPage = () => {
  const { id } = useParams(); // Get the movie ID from the URL parameters
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

  // Tambahkan state untuk director, genres, dan country
  const [director, setDirector] = useState(null);
  const [genres, setGenres] = useState([]);
  const [country, setCountry] = useState("");

  useEffect(() => {
    const fetchMovieData = async () => {
      const movieUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=images,videos,credits,recommendations,reviews`;

      try {
        const movieResponse = await fetch(movieUrl);
        if (!movieResponse.ok) throw new Error("Network response was not ok");

        const movieData = await movieResponse.json();

        // Ambil data director, genres, dan country dari response
        const directorData = movieData.credits.crew.find(
          (member) => member.job === "Director"
        );
        const countryData = movieData.production_countries[0]?.name;
        const genreData = movieData.genres;

        setMovie(movieData);
        setTrailers(movieData.videos.results.slice(0, 3)); // Limit to 3 trailers
        setActors(movieData.credits.cast.slice(0, 6)); // Limit to 6 actors
        setRecommendedMovies(movieData.recommendations.results.slice(0, 5)); // Limit to 5 recommended movies
        setReviews(movieData.reviews.results); // Set reviews from API response

        setDirector(directorData ? directorData.name : "Unknown");
        setGenres(genreData || []);
        setCountry(countryData || "Unknown");

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  const loadMoreReviews = () => {
    setVisibleReviews(visibleReviews + 3); // Menampilkan lebih banyak ulasan ketika tombol diklik
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    const newReviewData = {
      id: reviews.length + 1,
      author: newReview.username,
      content: newReview.content,
      created_at: new Date().toISOString(),
      author_details: {
        avatar_path: null,
      },
    };
    setReviews([...reviews, newReviewData]);
    setNewReview({ username: "", rating: 0, content: "" });
  };

  if (loading) return <p>Loading...</p>;
  if (error || !movie)
    return <p>Error: {error?.message || "Movie not found"}</p>;

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
          <Row className="d-flex align-items-center justify-content-center">
            <Col lg={4} md={6} sm={12} className="text-center mb-4 mb-lg-0">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="img-fluid rounded shadow-lg"
                  style={{
                    maxHeight: "600px",
                    objectFit: "cover",
                    width: "100%",
                  }} // Membuat gambar poster menyesuaikan lebar layar
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
                  fontSize: "3rem", // Menyesuaikan ukuran font untuk responsif
                }}
              >
                {movie.original_title}{" "}
                {movie.release_date ? movie.release_date.split("-")[0] : ""}
              </h1>
              <div className="d-flex align-items-center mb-3 flex-wrap">
                <span
                  className="badge bg-success me-2"
                  style={{ fontSize: "1.2rem", marginBottom: "10px" }}
                >
                  {movie.vote_average}/10
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
                  marginBottom: "20px",
                  textAlign: "justify", // Justify text for better readability
                }}
              >
                {movie.overview}
              </p>
              <div className="mb-2">
                <strong>Director:</strong> {director}
              </div>
              <div className="mb-2">
                <strong>Country:</strong> {country}
              </div>
              <div className="mb-4">
                <strong>Release Date:</strong> {movie.release_date}
              </div>
              <Button variant="danger" className="btn-lg">
                Watch Now
              </Button>
            </Col>
          </Row>
        </Container>
      </header>

      {/* Trailer Section */}
      <Container className="mt-5">
        <h2 className="text-white">Trailers</h2>
        <Carousel>
          {trailers.map((trailer) => (
            <Carousel.Item key={trailer.id}>
              <div
                className="embed-responsive"
                style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                  overflow: "hidden",
                  maxWidth: "100%",
                  background: "#000",
                }}
              >
                <iframe
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "0",
                    borderRadius: "20px",
                  }}
                  className="embed-responsive-item"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={trailer.name}
                  allowFullScreen
                ></iframe>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>

      {/* Cast Section */}
      <Container className="mt-5">
        <h2 className="text-white">Cast</h2>
        <Row>
          {actors.map((actor) => (
            <Col md={2} key={actor.id}>
              <div className="text-center">
                <Link to={`/celeb/${actor.id}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                    alt={actor.name}
                    className="img-fluid rounded"
                  />
                </Link>
                <Link to={`/celeb/${actor.id}`} className="text-white">
                  <p className="mt-2">{actor.name}</p>
                </Link>
                <p className="text-danger">{actor.character}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

     {/* Recommended Movies Section */}
     <Container className="mt-5">
        <h2 className="text-white">Recommended Movies</h2>
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
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
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
                      border: `5px solid ${movie.vote_average >= 7 ? "green" : "red"}`,
                      borderColor: `conic-gradient(green ${movie.vote_average * 10}%, #ccc 0)`,
                    }}
                  >
                    <span className="rating-text">{movie.vote_average}</span>
                  </div>
                </div>

                {/* YouTube Search Icon */}
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title)}`}
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
        <h2 className="text-white mb-4">Reviews ({reviews.length})</h2>
        {reviews.slice(0, visibleReviews).map((review) => (
          <div
            key={review.id}
            className="review-item d-flex mb-4"
            style={{
              paddingBottom: "15px",
              paddingTop: "15px",
            }}
          >
            <div
              className="review-avatar d-flex align-items-center justify-content-center"
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "#ccc",
                borderRadius: "50%",
                marginRight: "15px",
                overflow: "hidden", // Memastikan konten tidak meluap dari kontainer lingkaran
                flexShrink: "0", // Ini memastikan ukuran kontainer avatar tetap
              }}
            >
              {review.author_details.avatar_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`}
                  alt={review.author}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // Memastikan gambar menyesuaikan kontainer tanpa distorsi
                    borderRadius: "50%",
                  }}
                />
              ) : (
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
                  {review.author[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className="review-details flex-grow-1">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="review-author text-white fw-bold">
                  {review.author}
                </div>
                <div
                  className="review-date text-muted"
                  style={{ fontSize: "0.85rem" }}
                >
                  {new Date(review.created_at).toLocaleString()}
                </div>
              </div>
              <div
                className="review-text text-white"
                style={{ fontSize: "1rem", lineHeight: "1.5" }}
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
      <Container className="mt-5">
        <h2 className="text-white">Add Your Review</h2>
        <Form onSubmit={handleAddReview}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username"
              value={newReview.username}
              onChange={(e) =>
                setNewReview({ ...newReview, username: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Rating</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter your rating (1-10)"
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: e.target.value })
              }
              min="1"
              max="10"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
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
          <Button variant="primary" type="submit">
            Submit Review
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default MovieDetailPage;
