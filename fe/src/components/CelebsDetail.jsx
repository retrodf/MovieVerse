import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faYoutube } from "@fortawesome/free-brands-svg-icons";
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
    </Container>
  );
};

export default CelebsDetail;
