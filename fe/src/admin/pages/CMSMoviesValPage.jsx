import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Select,
  Modal,
  Form,
  Input,
  InputNumber,
  AutoComplete,
  message,
  Space,
  Checkbox,
} from "antd";
import { EditOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import axios from "axios";
import { URL } from "../../utils";
import "../style/MoviesValidate.css";

const { Option } = Select;

const CMSmoviesValidate = () => {
  const [statusFilter, setStatusFilter] = useState("None");
  const [showCount, setShowCount] = useState(10);
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form] = Form.useForm();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [directors, setDirectors] = useState([]);
  const [directorOptions, setDirectorOptions] = useState([]);
  const [directorInput, setDirectorInput] = useState("");
  const [suggestedDirectors, setSuggestedDirectors] = useState([]);
  const [selectedDirector, setSelectedDirector] = useState(null);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [actorInput, setActorInput] = useState("");
  const [suggestedActors, setSuggestedActors] = useState([]);
  const [selectedActors, setSelectedActors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [trailerInputs, setTrailerInputs] = useState([""]);

  // **Tambahkan fungsi ini**
  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  const handleShowCountChange = (value) => {
    setShowCount(value);
  };

  // Fetch movies data from backend
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);

        // Ambil token dari localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          message.error("No token found. Please log in.");
          setIsLoading(false);
          return;
        }

        // Sertakan token dalam header permintaan
        const response = await axios.get(`${URL}/admin/movie`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched movies data:", response.data);
        setDataSource(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
        message.error("Failed to fetch movies data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const fetchDirectors = async (searchInput) => {
    try {
      const response = await axios.get(`${URL}/directors`, {
        params: { search: searchInput },
      });

      const directors = Array.isArray(response.data)
        ? response.data
        : [response.data];

      const formattedDirectors = directors.map((director) => ({
        value: director.name,
        label: director.name,
        id: director.id,
      }));

      setSuggestedDirectors(formattedDirectors);
    } catch (error) {
      console.error("Error fetching directors:", error);
      message.error("Failed to fetch directors.");
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${URL}/countries`);
      setCountries(response.data?.countries || []);
    } catch (error) {
      console.error("Failed to fetch countries:", error);
      message.error("Failed to fetch countries");
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // Fungsi untuk menangani perubahan input pada AutoComplete
  const handleDirectorInputChange = (value) => {
    setDirectorInput(value);

    if (value.length > 0) {
      fetchDirectors(value);
    } else {
      setSuggestedDirectors([]);
    }
  };

  // Fungsi untuk menangani pemilihan direktur dari daftar AutoComplete
  const handleDirectorSelect = (value, option) => {
    setSelectedDirector({ id: option.id, name: option.value });
    setDirectorInput(option.value);
    setSuggestedDirectors([]);
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
      message.error("Failed to fetch actors");
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

  const fetchGenres = async () => {
    try {
      const response = await axios.get(`${URL}/genres`);
      setGenres(response.data.genres || []);
    } catch (error) {
      console.error("Failed to fetch genres:", error);
      message.error("Failed to fetch genres.");
    }
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenres((prevGenres) => {
      // Pastikan nilai yang diterima adalah benar
      if (prevGenres.includes(genreId)) {
        return prevGenres.filter((id) => id !== genreId);
      } else {
        return [...prevGenres, genreId];
      }
    });
  };

  const handleAddTrailer = () => {
    setTrailerInputs([
      ...trailerInputs,
      { id: null, url: "", title: `Trailer ${trailerInputs.length + 1}` },
    ]);
  };

  const handleRemoveTrailer = async (id) => {
    if (id) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${URL}/admin/movie-videos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success("Trailer removed successfully");
      } catch (error) {
        message.error("Failed to remove trailer");
        console.error(error);
      }
    }

    // Hapus dari state
    setTrailerInputs(trailerInputs.filter((trailer) => trailer.id !== id));
  };

  const handleTrailerChange = (index, updatedTrailer) => {
    const updatedTrailers = [...trailerInputs];
    updatedTrailers[index] = updatedTrailer;
    setTrailerInputs(updatedTrailers);
  };

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
        message.error("Failed to fetch initial data.");
      }
    };

    fetchData();
  }, []);

  // Filter data berdasarkan statusFilter
  useEffect(() => {
    if (statusFilter === "None") {
      setFilteredData(dataSource);
    } else {
      const approved = statusFilter === "Approved" ? 1 : 0;
      setFilteredData(
        dataSource.filter((movie) => movie.approval_status === approved)
      );
    }
  }, [statusFilter, dataSource]);

  // Aksi: Edit, Delete, Approve

  // Handle Edit
  const handleEdit = async (record) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("No token found. Please log in.");
        return;
      }

      // Fetch detail movie berdasarkan ID
      const response = await axios.get(`${URL}/admin/movie/${record.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const movieData = response.data;

      const trailerResponse = await axios.get(
        `${URL}/admin/movie-videos/${record.id}/videos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const trailers = trailerResponse.data.map((trailer) => ({
        id: trailer.id,
        url: trailer.url,
      }));

      // Parsing data Actors, Genres, Trailers, dan Country
      const actorsList = movieData.Actors || [];
      const genresList =
        movieData.Genres?.map((genre) => genre.name).join(", ") || "";

      setSelectedGenres(
        movieData.Genres ? movieData.Genres.map((genre) => genre.id) : []
      );
      setTrailerInputs(trailers); // Set nilai trailer URLs ke state trailerInputs

      // Siapkan data untuk diisi ke dalam form
      const formData = {
        title: movieData.title,
        rating: movieData.rating,
        synopsis: movieData.synopsis,
        release_date: movieData.release_date,
        director: movieData.Director?.name || "",
        country: movieData.Country?.name || "",
        actors: actorsList,
        genres: genresList,
        poster_url: movieData.poster_url,
      };

      // Update state Actors dan Country
      setSelectedActors(
        actorsList.map((actor) => ({
          id: actor.id,
          name: actor.name,
          image: actor.image || "", // Gunakan gambar default jika tidak ada
        }))
      );
      setSelectedCountry(movieData.Country?.countryId || null);

      // Set data ke form
      form.setFieldsValue(formData);
      setEditingMovie(movieData);
      setIsEditModalOpen(true);
    } catch (error) {
      message.error("Failed to fetch movie details");
      console.error("Failed to fetch movie details:", error);
    }
  };

  const handleSaveEdit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("No token found. Please log in.");
        return;
      }

      const updatedData = {
        title: values.title,
        rating: values.rating,
        synopsis: values.synopsis,
        releaseDate: values.release_date,
        poster: values.poster_url,
        country: selectedCountry,
        actors: selectedActors.map((actor) => actor.id),
        genres: selectedGenres,
        trailers: trailerInputs.map((trailer) => ({
          id: trailer.id,
          url: trailer.url,
          title: trailer.title, // Pastikan `title` disertakan
        })),
      };

      // Fetch directorId based on name
      const directorName = values.director.trim();
      const directorResponse = await axios.get(`${URL}/directors`, {
        params: { search: directorName },
      });

      const directors = Array.isArray(directorResponse.data)
        ? directorResponse.data
        : [directorResponse.data];

      const director = directors.find(
        (d) => d.name && d.name.toLowerCase() === directorName.toLowerCase()
      );

      if (director) {
        updatedData.directorId = director.id;
      } else {
        message.error(`Director "${directorName}" not found.`);
        return;
      }

      // Kirim data yang telah di-update ke backend
      await axios.put(`${URL}/admin/movie/${editingMovie.id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update dataSource lokal
      setDataSource((prevData) =>
        prevData.map((movie) =>
          movie.id === editingMovie.id ? { ...movie, ...updatedData } : movie
        )
      );

      setTrailerInputs([""]);
      message.success("Movie updated successfully");
      setIsEditModalOpen(false);
      setEditingMovie(null);
      form.resetFields();
    } catch (error) {
      if (error.response) {
        message.error(
          error.response.data?.message ||
            "Failed to update movie. Server error."
        );
      } else {
        message.error("Failed to update movie. Network error.");
      }
      console.error("Failed to update movie:", error);
    }
  };

  // Handle Delete
  const handleDelete = async (movieId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("No token found. Please log in.");
        return;
      }

      await axios.delete(`${URL}/admin/movie/${movieId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDataSource((prevData) =>
        prevData.filter((movie) => movie.id !== movieId)
      );
      message.success("Movie deleted successfully");
    } catch (error) {
      message.error("Failed to delete movie");
      console.error("Failed to delete movie:", error);
    }
  };

  // Handle Approve
  const handleApprove = async (movieId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("No token found. Please log in.");
        return;
      }

      await axios.put(`${URL}/admin/movie/${movieId}/approve`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDataSource((prevData) =>
        prevData.map((movie) =>
          movie.id === movieId ? { ...movie, approval_status: 1 } : movie
        )
      );
      message.success("Movie approved successfully");
    } catch (error) {
      message.error("Failed to approve movie");
      console.error("Failed to approve movie:", error);
    }
  };

  // Kolom tabel
  const columns = [
    {
      title: "No",
      key: "no",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Actors",
      key: "actors",
      render: (record) =>
        record.Actors?.map((actor) => actor.name).join(", ") || "N/A",
    },
    {
      title: "Genres",
      key: "genres",
      render: (record) =>
        record.Genres?.map((genre) => genre.name).join(", ") || "N/A",
    },
    {
      title: "Synopsis",
      dataIndex: "synopsis",
      key: "synopsis",
      render: (text) => <div className="synopsis-cell">{text}</div>,
    },
    {
      title: "Status",
      dataIndex: "approval_status",
      key: "status",
      align: "center",
      render: (status) =>
        status === 1 ? (
          <span style={{ color: "green", fontWeight: "bold" }}>Approved</span>
        ) : (
          <span style={{ color: "red", fontWeight: "bold" }}>Unapproved</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="ant-btn-edit"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            className="ant-btn-delete"
          />
          <Button
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record.id)}
            className="ant-btn-approve"
            disabled={record.approval_status === 1}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="movies-validate-page">
      <div className="header">
        <h2>Validate Movies</h2>
        <div className="filters">
          <Select
            value={statusFilter}
            onChange={handleStatusChange}
            style={{ width: 150 }}
          >
            <Option value="None">None</Option>
            <Option value="Approved">Approved</Option>
            <Option value="Unapproved">Unapproved</Option>
          </Select>
          <InputNumber
            min={1}
            max={100}
            value={showCount}
            onChange={handleShowCountChange}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: showCount }}
        rowKey={(record) => record.id}
        loading={isLoading}
        className="custom-table"
      />

      {/* Modal untuk Edit Movie */}
      <Modal
        title="Edit Movie"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveEdit}>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Rating" name="rating" rules={[{ required: true }]}>
            <InputNumber min={1} max={10} />
          </Form.Item>
          <Form.Item label="Synopsis" name="synopsis">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Release Date" name="release_date">
            <Input placeholder="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            label="Director"
            name="director"
            rules={[{ required: true, message: "Please select a director" }]}
          >
            <AutoComplete
              value={directorInput}
              options={suggestedDirectors}
              onSearch={handleDirectorInputChange}
              onSelect={handleDirectorSelect}
              placeholder="Search and select a director"
              allowClear
              filterOption={(inputValue, option) =>
                option.value.toLowerCase().includes(inputValue.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: "Please select a country" }]}
          >
            <Select
              placeholder="Select a country"
              value={selectedCountry} // State untuk nilai yang dipilih
              onChange={(value) => setSelectedCountry(value)} // Update state saat dipilih
              allowClear
            >
              {countries.map((country) => (
                <Select.Option
                  key={country.countryId}
                  value={country.countryId}
                >
                  {country.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Actors" name="actors">
            <div>
              <Input
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
            </div>

            <div className="selected-actors-list">
              {selectedActors.map((actor) => (
                <div key={actor.id} className="selected-actor-item">
                  <img
                    src={actor.image || "https://via.placeholder.com/50"} // Placeholder jika tidak ada gambar
                    alt={actor.name}
                    className="actor-photo"
                    style={{
                      width: "50px",
                      height: "50px",
                      marginRight: "10px",
                    }}
                  />
                  {actor.name}
                  <Button
                    type="link"
                    onClick={() => handleRemoveActor(actor.id)}
                    style={{ color: "red", marginLeft: "10px" }}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </Form.Item>
          <Form.Item label="Genres" name="genres">
            <div className="genre-grid-container">
              {genres.map((genre) => (
                <div key={genre.id} className="genre-checkbox-item">
                  <Checkbox
                    value={genre.id} // Pastikan value sesuai dengan genre.id
                    checked={selectedGenres.includes(genre.id)}
                    onChange={() => handleGenreChange(genre.id)}
                  >
                    {genre.name}
                  </Checkbox>
                </div>
              ))}
            </div>
          </Form.Item>
          <Form.Item label="Poster URL" name="poster_url">
            <Input />
          </Form.Item>
          <Form.Item label="Trailer URLs">
            {trailerInputs.map((trailer, index) => (
              <div key={trailer.id || index} className="d-flex mb-2">
                <Input
                  type="text"
                  placeholder={`Trailer link ${index + 1}`}
                  value={trailer.url}
                  onChange={(e) =>
                    handleTrailerChange(index, {
                      ...trailer,
                      url: e.target.value,
                    })
                  }
                />
                <Input
                  type="text"
                  placeholder="Trailer title"
                  value={trailer.title}
                  onChange={(e) =>
                    handleTrailerChange(index, {
                      ...trailer,
                      title: e.target.value,
                    })
                  }
                />
                {trailer.id && (
                  <Button
                    type="link"
                    danger
                    onClick={() => handleRemoveTrailer(trailer.id)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            ))}
            <Button type="dashed" onClick={handleAddTrailer}>
              Add Trailer
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CMSmoviesValidate;
