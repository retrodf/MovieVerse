import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import "../styles/AddMovie.css";
import { URL } from "../utils";

const AddMoviePage = () => {
  const [title, setTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [synopsis, setSynopsis] = useState("");
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [posterLink, setPosterLink] = useState("");
  const [rating, setRating] = useState("");
  const [actorInput, setActorInput] = useState("");
  const [suggestedActors, setSuggestedActors] = useState([]);
  const [selectedActors, setSelectedActors] = useState([]);
  const [errors, setErrors] = useState({});
  const [previewPoster, setPreviewPoster] = useState("");
  const [trailerInputs, setTrailerInputs] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);
  const [directorInput, setDirectorInput] = useState("");
  const [suggestedDirectors, setSuggestedDirectors] = useState([]);
  const [selectedDirector, setSelectedDirector] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countriesResponse, genresResponse, actorsResponse] =
          await Promise.all([
            axios.get(`${URL}/countries`),
            axios.get(`${URL}/genres`),
            axios.get(`${URL}/actors`),
          ]);

        setCountries(countriesResponse.data.countries || []);
        setGenres(genresResponse.data.genres || []);
        setSuggestedActors(actorsResponse.data.actors || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire("Error", "Failed to fetch data from backend", "error");
      }
    };

    fetchData();
  }, []);

  const handleGenreChange = (genreId) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genreId)
        ? prevGenres.filter((id) => id !== genreId)
        : [...prevGenres, genreId]
    );
  };

  const fetchActors = async (searchInput) => {
    try {
      const response = await axios.get(`${URL}/actors`, {
        params: {
          search: searchInput,
          limit: 10,
        },
      });
      setSuggestedActors(response.data.actors || []);
    } catch (error) {
      console.error("Error fetching actors:", error);
      Swal.fire("Error", "Failed to fetch actors", "error");
    }
  };

  const handleActorInputChange = (e) => {
    const input = e.target.value;
    setActorInput(input);

    if (input.length > 0) {
      fetchActors(input);
    } else {
      setSuggestedActors([]);
    }
  };

  const handleActorSelect = (actor) => {
    if (!selectedActors.some((a) => a.id === actor.id)) {
      setSelectedActors((prevActors) => [...prevActors, actor]);
      setActorInput("");
      setSuggestedActors([]);
    }
  };

  const handleRemoveActor = (actorId) => {
    setSelectedActors((prevActors) =>
      prevActors.filter((actor) => actor.id !== actorId)
    );
  };

  const fetchDirectors = async (searchInput) => {
    try {
      const response = await axios.get(`${URL}/directors`, {
        params: {
          search: searchInput,
        },
      });
      setSuggestedDirectors(response.data || []);
    } catch (error) {
      console.error("Error fetching directors:", error);
      Swal.fire("Error", "Failed to fetch directors", "error");
    }
  };

  const handleDirectorInputChange = (e) => {
    const input = e.target.value;
    setDirectorInput(input);

    if (input.length > 0) {
      fetchDirectors(input);
    } else {
      setSuggestedDirectors([]);
    }
  };

  const handleDirectorSelect = (director) => {
    setSelectedDirector(director);
    setDirectorInput(director.name);
    setSuggestedDirectors([]); // Reset setelah memilih
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title) newErrors.title = "Title is required";
    if (!releaseDate) newErrors.releaseDate = "Release date is required";
    if (!country) newErrors.country = "Country is required";
    if (!synopsis) newErrors.synopsis = "Synopsis is required";
    if (selectedGenres.length === 0)
      newErrors.genres = "Please select at least one genre";
    if (selectedActors.length === 0)
      newErrors.actors = "Please select at least one actor";
    if (!selectedDirector) {
      newErrors.director = "Please select a director";
    }

    // Validasi untuk poster URL
    if (!/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))$/i.test(posterLink)) {
      newErrors.posterLink = "Invalid poster URL";
    }

    // Validasi untuk rating
    if (!rating || isNaN(parseFloat(rating)) || rating < 1 || rating > 10) {
      newErrors.rating = "Rating must be a valid number between 1 and 10";
    }

    if (trailerInputs.length === 0) {
      newErrors.trailerLinks = "Please provide at least one trailer URL";
    } else {
      trailerInputs.forEach((trailer, index) => {
        if (
          !/^(https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/[^\s]+(\?.*)?)$/i.test(
            trailer
          )
        ) {
          newErrors.trailerLinks = `Invalid trailer URL at position ${index + 1}`;
        }
      });
    }

    // Set errors dan return
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTrailer = () => {
    setTrailerInputs([...trailerInputs, ""]);
  };

  const handleRemoveTrailer = (index) => {
    const updatedTrailers = [...trailerInputs];
    updatedTrailers.splice(index, 1);
    setTrailerInputs(updatedTrailers);
  };

  const handleTrailerChange = (index, value) => {
    const updatedTrailers = [...trailerInputs];
    updatedTrailers[index] = value;
    setTrailerInputs(updatedTrailers);
  };

  const handlePosterPreview = (e) => {
    const url = e.target.value;
    setPosterLink(url);
    if (/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))$/i.test(url)) {
      setPreviewPoster(url);
    } else {
      setPreviewPoster("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const formData = {
          title,
          releaseDate,
          country,
          synopsis,
          genres: selectedGenres,
          directorId: selectedDirector ? selectedDirector.id : null,
          actors: selectedActors.map((actor) => actor.id),
          poster: posterLink,
          trailers: trailerInputs, // Mengirim array trailers
          rating: parseFloat(rating),
        };

        await axios.post(`${URL}/movies/add`, formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Reset form
        Swal.fire("Success", "Movie added successfully!", "success");
        setTitle("");
        setReleaseDate("");
        setCountry("");
        setSynopsis("");
        setSelectedGenres([]);
        setSelectedDirector(null);
        setSelectedActors([]);
        setPosterLink("");
        setRating("");
        setPreviewPoster("");
        setTrailerInputs([""]); // Reset trailer inputs
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to add movie";
        Swal.fire("Error", errorMessage, "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Container className="add-movie-page">
      <h2 className="add-movie-title text-center">Add New Movie</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-4">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <small className="text-danger">{errors.title}</small>
          )}
        </Form.Group>

        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Release Date</Form.Label>
              <Form.Control
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
              />
              {errors.releaseDate && (
                <small className="text-danger">{errors.releaseDate}</small>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Rating (1-10)</Form.Label>
              <Form.Control
                type="number"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                min="1"
                max="10"
              />
              {errors.rating && (
                <small className="text-danger">{errors.rating}</small>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-4">
          <Form.Label>Country</Form.Label>
          <Form.Select
            value={country}
            onChange={(e) => setCountry(Number(e.target.value))} // Simpan sebagai ID (angka)
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.countryId} value={country.countryId}>
                {country.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Genres</Form.Label>
          <div className="genre-checkbox-container">
            {genres.map((genre) => (
              <div key={genre.id} className="genre-checkbox-item">
                <Form.Check
                  type="checkbox"
                  label={genre.name}
                  checked={selectedGenres.includes(genre.id)}
                  onChange={() => handleGenreChange(genre.id)}
                />
              </div>
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Synopsis</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter synopsis"
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4 position-relative">
          <Form.Label>Director</Form.Label>
          <Form.Control
            type="text"
            placeholder="Type director's name"
            value={directorInput}
            onChange={handleDirectorInputChange}
            autoComplete="off"
          />
          {directorInput && suggestedDirectors.length > 0 && (
            <div className="autocomplete-dropdown">
              {suggestedDirectors.map((director) => (
                <li
                  key={director.id}
                  className="autocomplete-item"
                  onClick={() => handleDirectorSelect(director)}
                >
                  {director.name}
                </li>
              ))}
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-4 position-relative">
          <Form.Label>Actors</Form.Label>
          <Form.Control
            type="text"
            placeholder="Type actor's name"
            value={actorInput}
            onChange={handleActorInputChange}
            autoComplete="off"
          />
          {actorInput && suggestedActors.length > 0 && (
            <div className="autocomplete-dropdown">
              {suggestedActors.map((actor) => (
                <li
                  key={actor.id}
                  className="autocomplete-item"
                  onClick={() => handleActorSelect(actor)}
                >
                  {actor.name}
                </li>
              ))}
            </div>
          )}
        </Form.Group>

        <div className="selected-actors-list">
          {selectedActors.map((actor) => (
            <div key={actor.id} className="selected-actor-item">
              <img src={actor.image} alt={actor.name} className="actor-photo" />
              <button
                className="remove-btn"
                onClick={() => handleRemoveActor(actor.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <Form.Group className="mb-4">
          <Form.Label>Trailer URLs</Form.Label>
          {trailerInputs.map((trailer, index) => (
            <div key={index} className="d-flex mb-2">
              <Form.Control
                type="text"
                placeholder={`Enter trailer link ${index + 1}`}
                value={trailer}
                onChange={(e) => handleTrailerChange(index, e.target.value)}
              />
              {trailerInputs.length > 1 && (
                <Button
                  variant="danger"
                  onClick={() => handleRemoveTrailer(index)}
                >
                  ×
                </Button>
              )}
            </div>
          ))}
          <Button variant="secondary" onClick={handleAddTrailer}>
            Add Trailer
          </Button>
          {errors.trailerLinks && (
            <small className="text-danger">{errors.trailerLinks}</small>
          )}
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Poster URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter poster link"
            value={posterLink}
            onChange={handlePosterPreview}
          />
          {previewPoster && (
            <img
              src={previewPoster}
              alt="Poster Preview"
              className="poster-preview"
            />
          )}
        </Form.Group>

        <Button variant="danger" type="submit" disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : "Submit"}
        </Button>
      </Form>
    </Container>
  );
};

export default AddMoviePage;
