import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Checkbox,
  Row,
  Col,
  AutoComplete,
} from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../style/InputMoviesPage.css";
import { URL } from "../../utils";

const { Option } = Select;

const CMSInputNewMovies = () => {
  const [form] = Form.useForm();
  const [countries, setCountries] = useState([]);
  const [genres, setGenres] = useState([]);
  const [suggestedActors, setSuggestedActors] = useState([]);
  const [selectedActors, setSelectedActors] = useState([]);
  const [directorInput, setDirectorInput] = useState("");
  const [suggestedDirectors, setSuggestedDirectors] = useState([]);
  const [selectedDirector, setSelectedDirector] = useState(null);
  const [previewPoster, setPreviewPoster] = useState("");
  const [actorInput, setActorInput] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [posterLink, setPosterLink] = useState("");
  const [trailerInputs, setTrailerInputs] = useState([""]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countriesResponse, genresResponse] = await Promise.all([
          axios.get(`${URL}/countries`),
          axios.get(`${URL}/genres`),
        ]);

        setCountries(countriesResponse.data.countries || []);
        setGenres(genresResponse.data.genres || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire("Error", "Failed to fetch data from backend", "error");
      }
    };

    fetchData();
  }, []);

  // Autocomplete for Actors
  const handleActorSearch = async (input) => {
    if (input.length > 0) {
      try {
        const response = await axios.get(`${URL}/actors`, {
          params: { search: input },
        });
        const actors = response.data.actors || [];
        const formattedActors = actors.map((actor) => ({
          value: actor.name,
          id: actor.id,
          image: actor.image,
        }));
        setSuggestedActors(formattedActors);
      } catch (error) {
        console.error("Error fetching actors:", error);
        Swal.fire("Error", "Failed to fetch actors", "error");
      }
    } else {
      setSuggestedActors([]);
    }
  };

  const handleActorSelect = (value, option) => {
    const selected = suggestedActors.find((actor) => actor.value === value);
    if (selected && !selectedActors.some((actor) => actor.id === selected.id)) {
      setSelectedActors([...selectedActors, selected]);
      setActorInput("");
      form.setFieldsValue({ actorInput: "" });
    }
  };

  const fetchDirectors = async (searchInput) => {
    try {
      const response = await axios.get(`${URL}/directors`, {
        params: {
          search: searchInput,
        },
      });
      const directors = response.data || [];
      const formattedDirectors = directors.map((director) => ({
        value: director.name,
        label: director.name,
        id: director.id,
      }));
      setSuggestedDirectors(formattedDirectors);
    } catch (error) {
      console.error("Error fetching directors:", error);
      Swal.fire("Error", "Failed to fetch directors", "error");
    }
  };

  const handleDirectorInputChange = (value) => {
    setDirectorInput(value);

    if (value.length > 0) {
      fetchDirectors(value);
    } else {
      setSuggestedDirectors([]);
    }
  };

  // Autocomplete for Director
  const handleDirectorSearch = async (input) => {
    if (input.length > 0) {
      try {
        const response = await axios.get(`${URL}/directors`, {
          params: { search: input },
        });
        const directors = response.data.directors || [];

        const formattedDirectors = directors.map((director) => ({
          value: director.name,
          id: director.id,
        }));
        setSuggestedDirectors(formattedDirectors);
      } catch (error) {
        console.error("Error fetching directors:", error);
        Swal.fire("Error", "Failed to fetch directors", "error");
      }
    } else {
      setSuggestedDirectors([]);
    }
  };

  const handleDirectorSelect = (value, option) => {
    setSelectedDirector({ id: option.id, name: option.value });
    setDirectorInput(option.value);
    setSuggestedDirectors([]);
  };

  const handleGenreChange = (genreId, checked) => {
    setSelectedGenres((prevGenres) => {
      if (checked) {
        return [...prevGenres, genreId];
      } else {
        return prevGenres.filter((id) => id !== genreId);
      }
    });
  };

  const handlePosterPreview = (e) => {
    const url = e.target.value;
    setPosterLink(url);
    if (url.match(/(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i)) {
      setPreviewPoster(url);
    } else {
      setPreviewPoster("");
    }
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

  const handleSave = async (values) => {
    console.log("Form values:", values);
  
    const formData = {
      title: values.title,
      releaseDate: values.releaseDate?.format("YYYY-MM-DD"),
      country: values.countryId,
      synopsis: values.synopsis,
      genres: selectedGenres,
      directorId: selectedDirector ? selectedDirector.id : null,
      actors: selectedActors.map((actor) => actor.id),
      poster: posterLink,
      trailers: trailerInputs, // Mengirim array trailers
      rating: parseFloat(values.rating),
      approvalStatus: 1, // Menambahkan approval_status
    };
  
    // Validasi tambahan
    if (!formData.directorId) {
      Swal.fire("Error", "Please select a director", "error");
      return;
    }
  
    if (formData.trailers.length === 0) {
      Swal.fire("Error", "Please provide at least one trailer URL", "error");
      return;
    }
  
    if (!formData.poster || !formData.country) {
      Swal.fire("Error", "Please fill in all required fields", "error");
      return;
    }
  
    console.log("FormData to submit:", formData);
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire("Error", "No token found. Please login again.", "error");
        return;
      }
  
      await axios.post(`${URL}/admin/movie/add`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim()}`,
        },
      });
  
      Swal.fire("Success", "Movie added successfully!", "success");
      form.resetFields();
      setSelectedActors([]);
      setSelectedDirector(null);
      setSelectedGenres([]);
      setTrailerInputs([""]);
      setPosterLink("");
      setPreviewPoster("");
    } catch (error) {
      console.error("Error submitting form:", error.response?.data);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to add movie",
        "error"
      );
    }
  };  

  return (
    <div className="input-movies-page">
      <h2>Input New Movie</h2>
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter the title" }]}
        >
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Release Date"
              name="releaseDate"
              rules={[
                { required: true, message: "Please select release date" },
              ]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Rating (1-10)"
              name="rating"
              rules={[{ required: true, message: "Please enter rating" }]}
            >
              <Input type="number" min={1} max={10} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Country"
          name="countryId"
          rules={[{ required: true, message: "Please select a country" }]}
        >
          <Select
            placeholder="Select Country"
            options={countries.map((country) => ({
              label: country.name,
              value: country.countryId,
            }))}
            onChange={(value) => {
              form.setFieldsValue({ countryId: value });
            }}
          />
        </Form.Item>

        <Form.Item label="Genres" required>
          <div className="genre-checkbox-container-cms">
            {genres.map((genre) => (
              <div key={genre.id} className="genre-checkbox-item-cms">
                <Checkbox
                  checked={selectedGenres.includes(genre.id)}
                  onChange={(e) =>
                    handleGenreChange(genre.id, e.target.checked)
                  }
                >
                  {genre.name}
                </Checkbox>
              </div>
            ))}
          </div>
        </Form.Item>

        <Form.Item
          label="Synopsis"
          name="synopsis"
          rules={[{ required: true, message: "Please enter synopsis" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Director"
          name="directorInput"
          rules={[{ required: true, message: "Please select a director" }]}
        >
          <AutoComplete
            value={directorInput}
            options={suggestedDirectors}
            onSearch={handleDirectorInputChange}
            onSelect={handleDirectorSelect}
            placeholder="Select a director"
            allowClear
          />
        </Form.Item>

        <Form.Item label="Actors">
          <AutoComplete
            value={actorInput}
            options={suggestedActors.map((actor) => ({
              value: actor.value,
            }))}
            onSearch={handleActorSearch}
            onSelect={handleActorSelect}
            onChange={(value) => setActorInput(value)}
            placeholder="Type actor's name"
          />
        </Form.Item>

        <div className="selected-actors-list">
          {selectedActors.map((actor) => (
            <div key={actor.id} className="selected-actor-item">
              <img
                src={actor.image}
                alt={actor.value}
                className="actor-photo"
              />
              <button
                className="remove-btn"
                onClick={() =>
                  setSelectedActors((prev) =>
                    prev.filter((a) => a.id !== actor.id)
                  )
                }
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <Form.Item label="Trailer URLs">
          {trailerInputs.map((trailer, index) => (
            <div key={index} className="d-flex mb-2">
              <Input
                placeholder={`Enter trailer link ${index + 1}`}
                value={trailer}
                onChange={(e) => handleTrailerChange(index, e.target.value)}
              />
              {trailerInputs.length > 1 && (
                <Button onClick={() => handleRemoveTrailer(index)}>×</Button>
              )}
            </div>
          ))}
          <Button onClick={handleAddTrailer}>Add Trailer</Button>
        </Form.Item>

        <Form.Item
          label="Poster URL"
          name="posterLink"
          rules={[{ required: true, message: "Please enter poster URL" }]}
        >
          <Input value={posterLink} onChange={handlePosterPreview} />
        </Form.Item>

        {previewPoster && (
          <img
            src={previewPoster}
            alt="Poster Preview"
            className="poster-preview"
          />
        )}

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default CMSInputNewMovies;
