import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios'; // Tambahkan axios
import "../style/UserPage.css";


const CMSUserPage = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true); // Tambahkan loading state
  const [form] = Form.useForm();

  // Fetch data dari backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/cms/users'); // Pastikan URL benar
        setUsers(response.data.map((user, index) => ({ 
          key: user.user_id, // Menggunakan user_id sebagai key
          name: user.name, 
          email: user.email, 
          role: user.role,
          username: user.username, // Tambahkan username jika diperlukan
        })));
        setLoading(false); // Hentikan loading ketika data sudah diambil
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, []);

  // Function to handle editing
  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // Function to handle deleting a user (ini masih hanya secara local)
  const handleDelete = (key) => {
    setUsers(users.filter(user => user.key !== key));
  };

  // Function to handle saving the edited or new user
  const handleSave = (values) => {
    if (editingUser) {
      // Update user
      setUsers(users.map(user => (user.key === editingUser.key ? { ...user, ...values } : user)));
    } else {
      // Add new user
      const newUser = {
        key: `${users.length + 1}`,
        ...values,
      };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Columns for Antd Table
  const columns = [
    {
      title: 'No',
      key: 'no',
      align: 'center',
      render: (text, record, index) => index + 1, // Menggunakan index untuk nomor
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Username', // Tambahkan kolom Username
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
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
    <div className="user-page">
      <div className="user-header">
        <h2>User Management</h2>
        <Button type="primary" onClick={handleAdd}>Add New User</Button>
      </div>
      <Table columns={columns} dataSource={users} pagination={false} loading={loading} className="custom-table" />

      <Modal
        title={editingUser ? 'Edit User' : 'Add User'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={form.submit}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input the user\'s name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input the user\'s email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select the user\'s role!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CMSUserPage;
