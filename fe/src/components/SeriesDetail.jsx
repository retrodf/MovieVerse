import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Carousel,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { apiKey } from "../data";

const SeriesDetailPage = () => {
  const { id } = useParams(); // Get the series ID from the URL parameters
  const [backdrops, setBackdrops] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [actors, setActors] = useState([]);
  const [recommendedSeries, setRecommendedSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [series, setSeries] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(3); // Jumlah ulasan yang ditampilkan secara default
  const [newReview, setNewReview] = useState({
    username: "",
    rating: 0,
    content: "",
  });

  useEffect(() => {
    const fetchSeriesData = async () => {
      const imageUrl = `https://api.themoviedb.org/3/tv/${id}/images?api_key=${apiKey}`;
      const trailerUrl = `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${apiKey}`;
      const actorsUrl = `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${apiKey}`;
      const recommendedUrl = `https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${apiKey}`;
      const seriesUrl = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`;
      const reviewsUrl = `https://api.themoviedb.org/3/tv/${id}/reviews?api_key=${apiKey}`;

      try {
        const [
          imageResponse,
          trailerResponse,
          actorResponse,
          recommendedResponse,
          seriesResponse,
          reviewsResponse,
        ] = await Promise.all([
          fetch(imageUrl),
          fetch(trailerUrl),
          fetch(actorsUrl),
          fetch(recommendedUrl),
          fetch(seriesUrl),
          fetch(reviewsUrl),
        ]);

        if (
          !imageResponse.ok ||
          !trailerResponse.ok ||
          !actorResponse.ok ||
          !recommendedResponse.ok ||
          !seriesResponse.ok ||
          !reviewsResponse.ok
        ) {
          throw new Error("Network response was not ok");
        }

        const imageData = await imageResponse.json();
        const trailerData = await trailerResponse.json();
        const actorData = await actorResponse.json();
        const recommendedData = await recommendedResponse.json();
        const seriesData = await seriesResponse.json();
        const reviewsData = await reviewsResponse.json();

        setBackdrops(imageData.backdrops.slice(0, 5)); // Limit to 5 backdrops
        setTrailers(trailerData.results.slice(0, 3)); // Limit to 3 trailers
        setActors(actorData.cast.slice(0, 6)); // Limit to 6 actors
        setRecommendedSeries(recommendedData.results.slice(0, 5)); // Limit to 5 recommended series
        setSeries(seriesData);
        setReviews(reviewsData.results); // Set reviews from API response

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchSeriesData();
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
  if (error) return <p>Error: {error.message}</p>;

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
          {backdrops.map((backdrop, index) => (
            <Carousel.Item key={index}>
              <div
                style={{
                  backgroundImage: `url('https://image.tmdb.org/t/p/original${backdrop.file_path}')`,
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
                        <h1 className="mb-4 fw-bold">
                          {series.name} <br />
                          <span>{series.tagline}</span>
                        </h1>
                        <p className="mb-4 text-truncate">{series.overview}</p>
                        <button className="btn btn-danger btn-lg rounded-1">
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

      {/* Reviews Section */}
      <Container className="mt-5 reviews-section">
        <h2 className="text-white">Reviews ({reviews.length})</h2>
        {reviews.slice(0, visibleReviews).map((review) => (
          <div
            key={review.id}
            className="review-item d-flex align-items-start mb-4"
          >
            <div className="review-avatar mr-3">
              {review.author_details.avatar_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`}
                  alt={review.author}
                  className="rounded-circle"
                />
              ) : (
                <div
                  className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center"
                  style={{ width: "45px", height: "45px" }}
                >
                  {review.author[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className="review-details">
              <div className="review-author text-white fw-bold">
                {review.author}
              </div>
              <div className="review-date text-muted">
                {new Date(review.created_at).toLocaleString()}
              </div>
              <div className="review-text text-white">{review.content}</div>
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

export default SeriesDetailPage;
