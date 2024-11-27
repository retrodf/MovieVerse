import { useState } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import PopularMovies from "../components/PopMoviesHz"; // Pastikan ini adalah komponen PopularMovies
import TopRatedMovies from "../components/TopRatedMoviesHz"; // Pastikan ini adalah komponen TopRatedMovies

const MoviesPage = () => {
  const [activeTab, setActiveTab] = useState("popular"); // Tab default adalah popular

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Container style={{ paddingTop: "100px" }}>
      {/* Tabs menggunakan Button dari React Bootstrap */}
      <Row className="mb-4">
        <Col className="d-flex justify-content-center">
          <Button
            variant={activeTab === "popular" ? "danger" : "secondary"}
            className="me-2"
            onClick={() => handleTabClick("popular")}
          >
            POPULAR
          </Button>
          <Button
            variant={activeTab === "top_rated" ? "danger" : "secondary"}
            onClick={() => handleTabClick("top_rated")}
          >
            TOP RATED
          </Button>
        </Col>
      </Row>

      {/* Conditional Rendering based on the active tab */}
      <div className="movies-content">
        {activeTab === "popular" && <PopularMovies />}
        {activeTab === "top_rated" && <TopRatedMovies />}
      </div>
    </Container>
  );
};

export default MoviesPage;
