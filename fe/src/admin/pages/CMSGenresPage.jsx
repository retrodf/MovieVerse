import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios'; // Tambahkan axios
import "../style/GenresPage.css"; // CSS khusus untuk Genres

const CMSGenres = () => {
  const [genresData, setGenresData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [loading, setLoading] = useState(true); // Tambahkan loading state
  const [form] = Form.useForm();

  // Fetch data dari backend
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('http://localhost:8000/cms/genre'); // Pastikan URL backend benar
        setGenresData(
          response.data.map((genre) => ({
            key: genre.genre_id, // Gunakan genre_id dari database sebagai key
            genre: genre.genre_name, // Sesuaikan nama field dari database
          }))
        );
        setLoading(false); // Set loading ke false setelah data diterima
      } catch (error) {
        console.error('Error fetching genres:', error);
        setLoading(false); // Set loading ke false jika terjadi error
      }
    };

    fetchGenres();
  }, []);

  const handleEdit = (record) => {
    setEditingGenre(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (key) => {
    setGenresData(genresData.filter(genre => genre.key !== key));
  };

  const handleSave = (values) => {
    if (editingGenre) {
      setGenresData(genresData.map(genre => (genre.key === editingGenre.key ? { ...genre, ...values } : genre)));
    } else {
      const newGenre = {
        key: `${genresData.length + 1}`,
        ...values,
      };
      setGenresData([...genresData, newGenre]);
    }
    setIsModalOpen(false);
    setEditingGenre(null);
    form.resetFields();
  };

  const handleAdd = () => {
    setEditingGenre(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: 'No',
      key: 'no',
      align: 'center',
      render: (text, record, index) => index + 1, // Menggunakan index untuk nomor
    },
    {
      title: 'Genres',
      dataIndex: 'genre',
      key: 'genre',
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="genres-page">
      <div className="genres-header">
        <h2>Genres Management</h2>
        <Button type="primary" onClick={handleAdd}>Add New Genre</Button>
      </div>
      <Table columns={columns} dataSource={genresData} pagination={false} loading={loading} className="custom-table" />

      <Modal
        title={editingGenre ? 'Edit Genre' : 'Add Genre'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={form.submit}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Genre"
            name="genre"
            rules={[{ required: true, message: 'Please input the genre!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CMSGenres;
