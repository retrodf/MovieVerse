import { useState, useEffect } from "react";
import { Table, Button, Input, DatePicker, Space, Modal, message, Form, InputNumber, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from 'moment';
import "../style/MoviesValidate.css";  // Pastikan file CSS sesuai dengan kebutuhan
import axios from 'axios';

const { Option } = Select;

const CMSmoviesValPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [countries, setCountries] = useState([]);
  const [form] = Form.useForm();
  const [statusFilter, setStatusFilter] = useState("None");  // Untuk filter status approval
  const [showCount, setShowCount] = useState(10);  // Untuk kontrol jumlah data yang ditampilkan

  // Load movie data dari backend
  useEffect(() => {
    axios.get('http://localhost:5000/cms/movies-approved')
      .then(response => {
        setDataSource(response.data);
      })
      .catch(error => console.error('Failed to fetch movies:', error));

    // Load directors
    axios.get('http://localhost:5000/cms/directors')
      .then(response => setDirectors(response.data))
      .catch(error => console.error('Failed to fetch directors:', error));

    // Load countries
    axios.get('http://localhost:5000/cms/countries')
      .then(response => setCountries(response.data))
      .catch(error => console.error('Failed to fetch countries:', error));
  }, []);

  // Handle perubahan status filter
  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  // Handle perubahan jumlah data yang ditampilkan
  const handleShowCountChange = (value) => {
    setShowCount(value);
  };

  // Handle tombol edit
  const handleEdit = (record) => {
    setSelectedMovie(record);
    form.setFieldsValue({
      ...record,
      release_date: record.release_date ? moment(record.release_date) : null,  // Pre-fill tanggal
    });
    setIsModalOpen(true);  // Membuka modal untuk editing
  };

  // Handle simpan setelah editing
  const handleSave = async () => {
    try {
      const updatedValues = await form.validateFields();
      const movieId = selectedMovie.id;
      
      const updatedMovie = {
        ...updatedValues,
        release_date: updatedValues.release_date ? updatedValues.release_date.format('YYYY-MM-DD') : null,
      };

      await axios.put(`http://localhost:5000/cms/movies-approved/${movieId}`, updatedMovie);

      message.success('Movie updated successfully!');
      
      setDataSource(dataSource.map(movie => movie.id === movieId ? { ...movie, ...updatedMovie } : movie));

      setIsModalOpen(false);
      setSelectedMovie(null);
      form.resetFields();
    } catch (error) {
      message.error('Failed to update movie');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/cms/movies-approved/${id}`);
      message.success('Movie deleted!');
      setDataSource(dataSource.filter(movie => movie.id !== id));
    } catch (error) {
      message.error('Failed to delete movie');
    }
  };

  // Terapkan filter approval status
  const filteredData = dataSource.filter(movie => {
    if (statusFilter === "None") return true;
    if (statusFilter === "Approved") return movie.approval_status === 1;
    if (statusFilter === "Unapproved") return movie.approval_status === 0;
    return true;
  });

  const columns = [
    {
      title: "No",
      key: "no",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Director",
      dataIndex: "directorId",
      key: "directorId",
      render: (directorId) => {
        const director = directors.find(d => d.id === directorId);
        return director ? director.name : 'Unknown';
      },
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (country) => country || "Unknown", // Gunakan country name yang diambil dari join query
    },
    {
      title: "Release Date",
      dataIndex: "release_date",
      key: "release_date",
    },
    {
      title: "Synopsis",
      dataIndex: "synopsis",
      key: "synopsis",
    },
    {
      title: "Poster URL",
      dataIndex: "poster_url",
      key: "poster_url",
      render: (url) => <a href={url} target="_blank" rel="noopener noreferrer">Poster</a>,
    },
    {
      title: "Trailer URL",
      dataIndex: "trailer_url",
      key: "trailer_url",
      render: (url) => <a href={url} target="_blank" rel="noopener noreferrer">Trailer</a>,
    },
    {
      title: "Status",
      dataIndex: "approval_status",
      key: "approval_status",
      render: (status) => (status === 1 ? 'Approved' : 'Unapproved'),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="movies-validate-page">
      {/* Bagian Filter */}
      <div className="movies-validate-filters">
        <div className="filter-item">
          <span>Filtered by: </span>
          <Select
            value={statusFilter}
            onChange={handleStatusChange}
            style={{ width: 150 }}
          >
            <Option value="None">None</Option>
            <Option value="Unapproved">Unapproved</Option>
            <Option value="Approved">Approved</Option>
          </Select>
        </div>
        <div className="filter-item">
          <span>Shows: </span>
          <InputNumber
            min={1}
            max={100}
            value={showCount}
            onChange={handleShowCountChange}
          />
        </div>
      </div>

      {/* Bagian Tabel */}
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: showCount }}
        rowKey="id"
        className="custom-table"
      />

      {/* Modal untuk Editing */}
      <Modal
        title="Edit Movie"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText="Save"
      >
        {selectedMovie && (
          <Form form={form} layout="vertical">
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please input the movie title!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Rating"
              name="rating"
            >
              <InputNumber min={0} max={10} />
            </Form.Item>

            <Form.Item
              label="Director"
              name="directorId"
              rules={[{ required: true, message: "Please select a director!" }]}
            >
              <Select>
                {directors.map(director => (
                  <Option key={director.id} value={director.id}>{director.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Country"
              name="countryId"
              rules={[{ required: true, message: "Please select a country!" }]}
            >
              <Select>
                {countries.map(country => (
                  <Option key={country.countryId} value={country.countryId}>{country.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Release Date"
              name="release_date"
              rules={[{ required: true, message: "Please select the release date!" }]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
              label="Synopsis"
              name="synopsis"
              rules={[{ required: true, message: "Please input the synopsis!" }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
              label="Poster URL"
              name="poster_url"
              rules={[{ required: true, message: "Please input the poster URL!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Trailer URL"
              name="trailer_url"
            >
              <Input />
            </Form.Item>

            {/* Tambahkan pilihan untuk status approval */}
            <Form.Item
              label="Approval Status"
              name="approval_status"
              rules={[{ required: true, message: "Please select the approval status!" }]}
            >
              <Select>
                <Option value={1}>Approved</Option>
                <Option value={0}>Unapproved</Option>
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default CMSmoviesValPage;
