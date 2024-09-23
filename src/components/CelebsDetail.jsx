import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { apiKey } from "../data";
import "../styles/CelebsDetail.css"; // Import file CSS

const CelebsDetail = () => {
  const { id } = useParams(); // Get celeb ID from URL parameters
  const [celeb, setCeleb] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCelebDetails = async () => {
      const celebUrl = `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}`;
      const movieUrl = `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${apiKey}`;

      try {
        const [celebResponse, movieResponse] = await Promise.all([
          fetch(celebUrl),
          fetch(movieUrl),
        ]);

        if (!celebResponse.ok || !movieResponse.ok) {
          throw new Error("Network response was not ok");
        }

        const celebData = await celebResponse.json();
        const movieData = await movieResponse.json();

        setCeleb(celebData);
        setMovies(movieData.cast.slice(0, 10)); // Limit to 10 movies
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchCelebDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container className="celeb-detail-container">
      {/* Celebrity Details Section */}
      <Row>
        <Col md={3}>
          {" "}
          {/* Change to md={3} to make the image column smaller */}
          <img
            src={`https://image.tmdb.org/t/p/w500${celeb.profile_path}`}
            alt={celeb.name}
            className="img-fluid rounded"
          />
        </Col>
        <Col md={9}>
          {" "}
          {/* Change to md={9} to increase the size of the text column */}
          <h1 className="display-4">{celeb.name}</h1>
          <p>
            <strong>Birthday:</strong> {celeb.birthday}
          </p>
          <p>
            <strong>Place of Birth:</strong> {celeb.place_of_birth}
          </p>
          <p>{celeb.biography}</p>
        </Col>
      </Row>

      {/* Medias Section */}
      <div className="medias-section mt-5">
        <h2 className="section-title">MEDIAS</h2>
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
          {movies.map((movie) => (
            <div key={movie.id} className="movie-item">
              <Link to={`/movie/${movie.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title || movie.name}
                  className="movie-poster"
                />
              </Link>
              <div className="movie-info">
                <h5>{movie.title || movie.name}</h5>
                <p>{movie.release_date || movie.first_air_date}</p>

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
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title || movie.name)}`}
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
      </div>
    </Container>
  );
};

export default CelebsDetail;
