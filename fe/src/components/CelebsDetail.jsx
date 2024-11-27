import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { URL } from "../utils";
import "../styles/CelebsDetail.css";

const CelebsDetail = () => {
  const { id } = useParams();
  const [celeb, setCeleb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [country, setCountry] = useState("Unknown");

  useEffect(() => {
    const fetchCelebDetails = async () => {
      // Menggunakan URL yang benar dengan `/api/actors/${id}`
      const apiUrl = `${URL}/actors/${id}`;
      console.log("Fetching actor data from:", apiUrl);

      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch actor data: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        setCeleb(data.actor);
        setCountry(data.actor.Country?.name || "-");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching actor data:", error);
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
      <Row>
        <Col md={3}>
          <img
            src={celeb.image || "https://via.placeholder.com/500"}
            alt={celeb.name}
            className="img-fluid rounded"
          />
        </Col>
        <Col md={9}>
          <h1 className="display-4">{celeb.name}</h1>
          <p>
            <strong>Birthday:</strong> {celeb.birthdate || "Unknown"}
          </p>
          <p>
            <strong>Country:</strong> {country}
          </p>
          <p>{celeb.biography || "No biography available."}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default CelebsDetail;
