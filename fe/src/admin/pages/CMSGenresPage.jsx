import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import "../style/GenresPage.css";

const CMSGenres = () => {
  const [genresData, setGenresData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [form] = Form.useForm();

  // Fetch data dari backend
  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/genre');
      setGenresData(
        response.data.map((genre) => ({
          key: genre.id,
          genre: genre.name,
        }))
      );
    } catch (error) {
      console.error('Error fetching genres:', error);
      message.error("Failed to fetch genres");
    }
  };

  const handleEdit = (record) => {
    setEditingGenre(record);
    form.setFieldsValue({ genre: record.genre });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/genre/${id}`);
      message.success("Genre deleted successfully");
      fetchGenres();
    } catch (error) {
      console.error("Failed to delete genre:", error);
      message.error("Failed to delete genre");
    }
  };

  const handleSave = async (values) => {
    try {
      if (editingGenre) {
        // Update genre
        await axios.put(`http://localhost:3000/api/admin/genre/${editingGenre.key}`, { name: values.genre });
        message.success("Genre updated successfully");
      } else {
        // Add new genre
        await axios.post('http://localhost:3000/api/admin/genre', { name: values.genre });
        message.success("Genre added successfully");
      }
      fetchGenres();
      setIsModalOpen(false);
      form.resetFields();
      setEditingGenre(null);
    } catch (error) {
      console.error("Failed to save genre:", error);
      message.error("Failed to save genre");
    }
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
      <Table columns={columns} dataSource={genresData} pagination={false} className="custom-table" />

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
