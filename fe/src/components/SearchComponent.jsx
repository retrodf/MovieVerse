import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { URL } from "../utils";

import "../styles/Search.css";
import { debounce } from "lodash";

const SearchResultPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(9);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    genre: "",
    releaseYear: "",
    rating: "",
    country: "",
  });

  const [tempFilters, setTempFilters] = useState({
    genre: "",
    releaseYear: "",
    rating: "",
    country: "",
  });

  const [activeCategory, setActiveCategory] = useState("movies");
  const [sortBy, setSortBy] = useState("newest");

  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const years = Array.from({ length: 2024 - 2009 + 1 }, (_, i) => 2024 - i);

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`${URL}/genres`);
        const data = await response.json();
        if (Array.isArray(data.genres)) {
          setGenres(data.genres);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${URL}/countries`);
        const data = await response.json();
        console.log(data);
        if (Array.isArray(data.countries)) {
          setCountries(data.countries);
          console.log(data.countries);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // Fetch data movie dari backend dengan query dan filter
  const fetchMovies = async (
    query = "",
    genre = null,
    releaseYear = "",
    rating = "",
    country = null,
    sortBy = ""
  ) => {
    try {
      setLoading(true);
      let url = `${URL}/movies/search?`;

      const params = [];

      console.log(query);

      // Add the query parameter if it exists
      if (query) {
        params.push(`query=${encodeURIComponent(query)}`);
      }

      if (activeCategory) {
        params.push(`category=${encodeURIComponent(activeCategory)}`);
      }

      url += params.length > 0 ? params.join("&") : "";

      // Tambahkan genre dan country hanya jika ada pilihan dan valid
      if (genre && !isNaN(genre)) url += `&genre=${genre}`;
      if (releaseYear) url += `&releaseYear=${releaseYear}`;
      if (rating) url += `&rating=${rating}`;
      if (country && !isNaN(country)) url += `&country=${country}`;
      if (sortBy) url += `&sortBy=${sortBy}`;

      console.log("Request URL:", url); // Debug URL

      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Network response was not ok");
      }
      setMovies(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError(error);
      setLoading(false);
    }
  };

  const handleSearch = debounce((query) => {
    setSearchQuery(query);
  }, 500);

  useEffect(() => {
    const validGenre =
      filters.genre && !isNaN(filters.genre) ? filters.genre : null;
    const validCountry =
      filters.country && !isNaN(filters.country) ? filters.country : null;

    console.log("Sending request with parameters:");
    console.log("Genre ID:", validGenre);
    console.log("Country ID:", validCountry);
    console.log("Sort By:", sortBy); // Debug untuk sortBy

    fetchMovies(
      searchQuery,
      validGenre,
      filters.releaseYear,
      filters.rating,
      validCountry,
      sortBy
    );
  }, [searchQuery, filters, sortBy]);

  const handleSortBy = (sortKey) => {
    let backendSortKey = "";

    switch (sortKey) {
      case "Newest First":
        backendSortKey = "newest";
        break;
      case "Oldest First":
        backendSortKey = "oldest";
        break;
      case "A-Z":
        backendSortKey = "title_asc";
        break;
      case "Z-A":
        backendSortKey = "title_desc";
        break;
      default:
        backendSortKey = "newest";
    }

    setSortBy(backendSortKey); // Set sortBy dengan format backend
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    console.log(name + "-" + value);

    setTempFilters({
      ...tempFilters,
      [name]: value === "" ? null : Number(value),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFilters(tempFilters);
  };

  const handleClearFilters = () => {
    window.location.reload();
  };

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < Math.ceil(movies.length / moviesPerPage) &&
    setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const getPageNumbers = () =>
    Array.from({ length: totalPages }, (_, i) => i + 1);

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-white">Loading, please wait...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container d-flex flex-column align-items-center justify-content-center">
        <div
          className="alert-icon bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: "100px",
            height: "100px",
            fontSize: "40px",
          }}
        >
          &#9888; {/* Icon warning */}
        </div>
        <p className="mt-4 text-danger fw-bold fs-4">
          Oops! Something went wrong.
        </p>
        <p className="text-muted mb-4">
          {error.message || "We couldn't find what you were looking for."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary px-5 py-2"
          style={{
            backgroundColor: "#dc3545",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div className="main-content">
      <Container fluid className="search-result-page">
        {/* Buttons for category selection */}
        <Row className="mb-4">
          <Col className="d-flex justify-content-center">
            <Button
              variant={activeCategory === "movies" ? "danger" : "secondary"}
              className="me-2"
              onClick={() => setActiveCategory("movies")}
            >
              MOVIE
            </Button>
            <Button
              variant={activeCategory === "celebs" ? "danger" : "secondary"}
              onClick={() => setActiveCategory("celebs")}
            >
              CELEBS
            </Button>
          </Col>
        </Row>

        {/* Search Field */}
        <Row className="mb-4">
          <Col md={12}>
            <Form>
              <Form.Control
                type="text"
                placeholder={`Search ${
                  activeCategory === "movies" ? "Movies" : "Celebs"
                }`}
                className="search-field"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Form>
          </Col>
        </Row>

        <Row>
          <Col md={3} className="bg-dark p-3 rounded filter-sidebar">
            <h5 className="text-light">Filters</h5>
            {/* Genres Filter */}
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Genres</Form.Label>
              <Form.Select
                name="genre"
                value={tempFilters.genre}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {/* Release Year Filter */}
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Release Year</Form.Label>
              <Form.Select
                name="releaseYear"
                value={tempFilters.releaseYear}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {/* Rating Filter */}
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Rating</Form.Label>
              <Form.Select
                name="rating"
                value={tempFilters.rating}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Ratings</option>
                {[9, 8, 7, 6, 5, 4, 3, 2, 1].map((rate) => (
                  <option key={rate} value={rate}>
                    {rate}+
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {/* Country Filter */}
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Country</Form.Label>
              <Form.Select
                name="country"
                value={tempFilters.country}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country.countryId} value={country.countryId}>
                    {country.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {/* Buttons */}
            <Row>
              <Col>
                <Button
                  className="filter-button clear-button"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              </Col>
              <Col>
                <Button
                  className="filter-button submit-button"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </Col>
          {/* Section for Movies */}
          <Col md={9}>
            <Row className="mb-3">
              <Col>
                <h5>{movies.length} Movies</h5>
              </Col>
              <Col className="d-flex justify-content-end">
                <DropdownButton
                  id="dropdown-basic-button"
                  title={`Sort by: ${sortBy}`}
                  onSelect={handleSortBy}
                  variant="outline-secondary"
                  size="sm"
                  className="me-2"
                >
                  <Dropdown.Item eventKey="Newest First">
                    Newest First
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Oldest First">
                    Oldest First
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="A-Z">A-Z</Dropdown.Item>
                  <Dropdown.Item eventKey="Z-A">Z-A</Dropdown.Item>
                </DropdownButton>
              </Col>
            </Row>

            {/* Movies Display */}
            <div
              className="movie-list"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                padding: "10px 0",
              }}
            >
              {currentMovies.map((movie) => (
                <div key={movie.id} className="movie-item">
                  <Link to={`/movie/${movie.id}`}>
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="movie-poster"
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                        transition: "transform 0.3s",
                      }}
                    />
                  </Link>
                  <div className="movie-info">
                    <h5 style={styles.movieTitle}>{movie.title}</h5>
                    <p>{movie.release_date}</p>
                    <div className="rating-container">
                      <div
                        className="rating-circle"
                        style={{
                          border: `5px solid ${movie.rating >= 7 ? "green" : "red"}`,
                          borderColor: `conic-gradient(green ${movie.rating * 10}%, #ccc 0)`,
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <span>{movie.rating}</span>
                      </div>
                    </div>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                        movie.title
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        color="#dc3545"
                        icon={faYoutube}
                        size="2x"
                      />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination-container mt-4">
              <Button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="pagination-arrow"
              >
                &lt;
              </Button>

              {getPageNumbers().map((pageNumber) => (
                <Button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={`pagination-btn ${pageNumber === currentPage ? "active" : ""}`}
                >
                  {pageNumber}
                </Button>
              ))}

              <Button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="pagination-arrow"
              >
                &gt;
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const styles = {
  movieTitle: {
    textAlign: "center",
    whiteSpace: "normal",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
};

export default SearchResultPage;
