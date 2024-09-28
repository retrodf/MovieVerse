import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Dropdown,
  DropdownButton,
  Form,
} from "react-bootstrap";
import "../styles/SearchResultPage.css";
import StarIcon from "@mui/icons-material/Star";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";

const SearchResultPage = () => {
  // Data film manual (10 film)
  const movies = [
    {
      id: 1,
      title: "Kung Fu Panda 4",
      genre: ["Action", "Adventure", "Drama"],
      rating: 8.9,
      votes: 162764,
      popularity: 2.9,
      director: "Sian Heder",
      stars: ["Emilia Jones", "Marlee Matlin", "Troy Kotsur"],
      poster: "https://image.tmdb.org/t/p/w200/kungfu_panda.jpg",
    },
    {
      id: 2,
      title: "The Avengers",
      genre: ["Action", "Sci-Fi"],
      rating: 8.4,
      votes: 2109847,
      popularity: 5.2,
      director: "Joss Whedon",
      stars: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
      poster: "https://image.tmdb.org/t/p/w200/avengers.jpg",
    },
    {
      id: 3,
      title: "Inception",
      genre: ["Action", "Sci-Fi", "Thriller"],
      rating: 8.8,
      votes: 2145820,
      popularity: 3.5,
      director: "Christopher Nolan",
      stars: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
      poster: "https://image.tmdb.org/t/p/w200/inception.jpg",
    },
    {
      id: 4,
      title: "The Dark Knight",
      genre: ["Action", "Drama", "Crime"],
      rating: 9.0,
      votes: 2455162,
      popularity: 4.0,
      director: "Christopher Nolan",
      stars: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
      poster: "https://image.tmdb.org/t/p/w200/dark_knight.jpg",
    },
    {
      id: 5,
      title: "Interstellar",
      genre: ["Adventure", "Drama", "Sci-Fi"],
      rating: 8.6,
      votes: 1589740,
      popularity: 3.2,
      director: "Christopher Nolan",
      stars: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
      poster: "https://image.tmdb.org/t/p/w200/interstellar.jpg",
    },
    {
      id: 6,
      title: "The Matrix",
      genre: ["Action", "Sci-Fi"],
      rating: 8.7,
      votes: 1679644,
      popularity: 3.9,
      director: "Lana Wachowski",
      stars: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
      poster: "https://image.tmdb.org/t/p/w200/matrix.jpg",
    },
    {
      id: 7,
      title: "Pulp Fiction",
      genre: ["Crime", "Drama"],
      rating: 8.9,
      votes: 1985337,
      popularity: 2.8,
      director: "Quentin Tarantino",
      stars: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
      poster: "https://image.tmdb.org/t/p/w200/pulp_fiction.jpg",
    },
    {
      id: 8,
      title: "Fight Club",
      genre: ["Drama"],
      rating: 8.8,
      votes: 1945374,
      popularity: 2.7,
      director: "David Fincher",
      stars: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter"],
      poster: "https://image.tmdb.org/t/p/w200/fight_club.jpg",
    },
    {
      id: 9,
      title: "Forrest Gump",
      genre: ["Drama", "Romance"],
      rating: 8.8,
      votes: 1925863,
      popularity: 2.6,
      director: "Robert Zemeckis",
      stars: ["Tom Hanks", "Robin Wright", "Gary Sinise"],
      poster: "https://image.tmdb.org/t/p/w200/forrest_gump.jpg",
    },
    {
      id: 10,
      title: "The Lord of the Rings: The Return of the King",
      genre: ["Adventure", "Drama", "Fantasy"],
      rating: 9.0,
      votes: 1743523,
      popularity: 4.5,
      director: "Peter Jackson",
      stars: ["Elijah Wood", "Viggo Mortensen", "Ian McKellen"],
      poster: "https://image.tmdb.org/t/p/w200/lotr.jpg",
    },
  ];

  const [viewMode, setViewMode] = useState("List"); // List or Grid
  const [sortBy, setSortBy] = useState("Ranking");
  const [filters, setFilters] = useState({
    genre: "",
    titleType: "",
    releaseYear: "",
    rating: "",
    country: "",
  });

  const handleSortBy = (sortKey) => {
    setSortBy(sortKey);
  };

  const handleViewMode = (mode) => {
    setViewMode(mode);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const applyFilters = () => {
    console.log(filters);
  };

  return (
    <div className="main-content">
      <Container
        fluid
        className="search-result-page"
        style={{ paddingTop: "80px", color: "#fff" }}
      >
        <Row>
          {/* Sidebar for Filters */}
          <Col
            md={3}
            className="bg-dark p-3 rounded"
            style={{ height: "100vh" }}
          >
            <h5 className="text-light">Filters</h5>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Genres</Form.Label>
              <Form.Select name="genre" onChange={handleFilterChange}>
                <option value="">All Genres</option>
                <option value="action">Action</option>
                <option value="comedy">Comedy</option>
                <option value="drama">Drama</option>
                <option value="thriller">Thriller</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Title Type</Form.Label>
              <Form.Select name="titleType" onChange={handleFilterChange}>
                <option value="">All Types</option>
                <option value="movie">Movie</option>
                <option value="series">Series</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Release Year</Form.Label>
              <Form.Control
                type="number"
                name="releaseYear"
                placeholder="Enter year"
                onChange={handleFilterChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Rating</Form.Label>
              <Form.Select name="rating" onChange={handleFilterChange}>
                <option value="">All Ratings</option>
                <option value="8">8+</option>
                <option value="7">7+</option>
                <option value="6">6+</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Country</Form.Label>
              <Form.Select name="country" onChange={handleFilterChange}>
                <option value="">All Countries</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="fr">France</option>
              </Form.Select>
            </Form.Group>
            <Button variant="outline-light" onClick={applyFilters}>
              Apply Filters
            </Button>
          </Col>

          <Col md={9}>
            <Row className="mb-3">
              <Col>
                <h5>{movies.length} titles</h5> {/* Menampilkan jumlah film */}
              </Col>
              <Col className="d-flex justify-content-end">
                {/* Dropdown Sort By */}
                <DropdownButton
                  id="dropdown-basic-button"
                  title={`Sort by: ${sortBy}`}
                  onSelect={handleSortBy}
                  variant="outline-secondary"
                  size="sm"
                  className="me-2"
                >
                  <Dropdown.Item eventKey="Ranking">Ranking</Dropdown.Item>
                  <Dropdown.Item eventKey="Rating">Rating</Dropdown.Item>
                  <Dropdown.Item eventKey="Release Date">
                    Release Date
                  </Dropdown.Item>
                </DropdownButton>

                {/* View Mode Buttons */}
                <Button
                  variant={viewMode === "List" ? "light" : "outline-secondary"}
                  size="sm"
                  onClick={() => handleViewMode("List")}
                  className="me-2"
                >
                  <ViewListIcon />
                </Button>
                <Button
                  variant={viewMode === "Grid" ? "light" : "outline-secondary"}
                  size="sm"
                  onClick={() => handleViewMode("Grid")}
                >
                  <GridViewIcon />
                </Button>
              </Col>
            </Row>

            {/* Search Result Section */}
            {viewMode === "List" ? (
              // List View Mode
              movies.map((movie, index) => (
                <Card
                  key={movie.id}
                  className="mb-3 bg-dark text-white"
                  style={{ borderRadius: "10px" }}
                >
                  <Card.Body>
                    <Row>
                      <Col md={2}>
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="img-fluid"
                          style={{ borderRadius: "8px" }}
                        />
                      </Col>
                      <Col md={8}>
                        <h5>
                          {index + 1}. {movie.title}
                        </h5>
                        <div>
                          {movie.genre.map((g, idx) => (
                            <Badge key={idx} bg="secondary" className="me-1">
                              {g}
                            </Badge>
                          ))}
                        </div>
                        <p className="mt-2" style={{ fontSize: "14px" }}>
                          Nine noble families fight for control over the lands
                          of Westeros, while an ancient enemy returns after
                          being dormant for a millennia.
                        </p>
                        <p style={{ fontSize: "14px" }}>
                          Director:{" "}
                          <span className="text-danger">{movie.director}</span>
                        </p>
                        <p style={{ fontSize: "14px" }}>
                          Stars:{" "}
                          <span className="text-danger">
                            {movie.stars.join(", ")}
                          </span>
                        </p>
                        <p style={{ fontSize: "14px" }}>
                          Votes: {movie.votes.toLocaleString()}
                        </p>
                      </Col>
                      <Col
                        md={2}
                        className="d-flex align-items-center justify-content-end"
                      >
                        <div>
                          <h5 className="text-warning">
                            <StarIcon /> {movie.rating.toFixed(1)} (
                            {movie.popularity.toFixed(1)}M)
                          </h5>
                          <Button variant="outline-light" className="mt-2">
                            Rate
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))
            ) : (
              // Grid View Mode
              <Row>
                {movies.map((movie) => (
                  <Col key={movie.id} md={3}>
                    <Card
                      className="mb-3 bg-dark text-white"
                      style={{ borderRadius: "10px" }}
                    >
                      <Card.Img
                        variant="top"
                        src={movie.poster}
                        alt={movie.title}
                        style={{ borderRadius: "8px" }}
                      />
                      <Card.Body>
                        <h5>{movie.title}</h5>
                        <h5 className="text-warning">
                          <StarIcon /> {movie.rating.toFixed(1)}
                        </h5>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SearchResultPage;
