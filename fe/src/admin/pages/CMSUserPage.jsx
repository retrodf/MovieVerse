import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Select,
  InputNumber,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { URL } from "../../utils";
import "../style/UserPage.css";

const CMSUserPage = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("None");
  const [showCount, setShowCount] = useState(10);
  const [form] = Form.useForm();
  const { Option } = Select;
  const navigate = useNavigate();

  // Periksa apakah pengguna memiliki peran "admin" saat halaman dimuat
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      message.error(
        "Akses ditolak. Anda tidak memiliki izin untuk mengakses halaman ini."
      );
      navigate("/no-access"); // Arahkan ke halaman akses ditolak
    } else {
      fetchUsers(); // Jika admin, lanjutkan untuk mengambil data pengguna
    }
  }, [navigate]);

  // Fungsi untuk mengambil data pengguna
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${URL}/admin/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(
        response.data.data.map((user) => ({
          id: user.id,
          key: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          username: user.username,
          isSuspended: user.isSuspended,
        }))
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Gagal mengambil data pengguna");
      setLoading(false);
    }
  };

  // Fungsi untuk menambah atau memperbarui pengguna
  const handleSave = async (values) => {
    const token = localStorage.getItem("token");
    if (editingUser) {
      try {
        await axios.put(`${URL}/admin/user/${editingUser.key}`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success("User berhasil diperbarui");
        fetchUsers();
      } catch (error) {
        console.error("Error updating user:", error);
        message.error("Gagal memperbarui user");
      }
    } else {
      try {
        await axios.post(`${URL}/admin/user/create`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success("User berhasil ditambahkan");
        fetchUsers();
      } catch (error) {
        console.error("Error adding user:", error);
        message.error("Gagal menambahkan user");
      }
    }
    setIsModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  // Fungsi untuk menghapus pengguna
  const handleDelete = async (key) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${URL}/admin/user/${key}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("User berhasil dihapus");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Gagal menghapus user");
    }
  };

  // Fungsi untuk mengedit pengguna
  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // Fungsi untuk menambahkan pengguna baru
  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSuspend = async (user) => {
    const token = localStorage.getItem("token");
    const newStatus = !user.isSuspended; // Toggle suspend status

    try {
      await axios.put(
        `${URL}/admin/user/${user.id}/suspend`, // Sesuaikan URL ini agar cocok dengan rute di backend
        { isSuspended: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success(
        `User ${user.name} berhasil di ${newStatus ? "suspend" : "aktifkan kembali"}`
      );
      fetchUsers();
    } catch (error) {
      console.error("Error suspending user:", error);
      message.error("Gagal mengubah status suspend user");
    }
  };

  const handleRoleChange = (value) => {
    setRoleFilter(value);
  };

  const handleShowCountChange = (value) => {
    setShowCount(value);
  };

  const filteredData = users.filter((user) =>
    roleFilter === "None" ? true : user.role === roleFilter
  );

  // Kolom tabel
  const columns = [
    {
      title: "No",
      key: "no",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      align: "center",
      key: "role",
    },
    {
      title: "Suspended",
      dataIndex: "isSuspended",
      align: "center",
      key: "isSuspended",
      render: (isSuspended) =>
        isSuspended ? (
          <span style={{ color: "red", fontWeight: "bold" }}>Suspended</span>
        ) : (
          <span style={{ color: "green", fontWeight: "bold" }}>Active</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <Space size="middle">
          <Button
            className="ant-btn-edit"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            className={`ant-btn-delete-usr ${record.role === "admin" ? "disabled-button" : ""}`}
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
            disabled={record.role === "admin"}
            style={
              record.role === "admin"
                ? {
                    backgroundColor: "#f8b4b4",
                    color: "#ffffff",
                    border: "none",
                  }
                : {}
            }
          />
          <Button
            className={`ant-btn-suspend ${record.role === "admin" ? "disabled-button" : ""}`}
            onClick={() => handleSuspend(record)}
            disabled={record.role === "admin"}
            style={
              record.role === "admin"
                ? {
                    backgroundColor: "#f8b4b4",
                    color: "#ffffff",
                    border: "none",
                  }
                : {}
            }
          >
            {record.isSuspended ? "Unsuspend" : "Suspend"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-page">
      <div className="user-header">
        <h2>User Management</h2>
        <div className="user-controls">
          <div className="user-filters">
            <div className="filter-item">
              <span>Filter by Role:</span>
              <Select
                value={roleFilter}
                onChange={handleRoleChange}
                style={{ width: 150 }}
              >
                <Option value="None">None</Option>
                <Option value="admin">Admin</Option>
                <Option value="user">User</Option>
              </Select>
            </div>
            <div className="filter-item">
              <span>Show:</span>
              <InputNumber
                min={1}
                max={100}
                value={showCount}
                onChange={handleShowCountChange}
              />
            </div>
          </div>
          <Button className="ant-btn-new-user" onClick={handleAdd}>
            + New User
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: showCount }}
        rowKey={(record) => record.id}
        className="custom-table"
        loading={loading}
      />

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={form.submit}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input the user's name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input the user's email!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please input the user's username!" },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Field Password hanya muncul jika role adalah 'admin' */}
          {editingUser && editingUser.role === "admin" && (
            <Form.Item
              label="Password"
              name="password"
              rules={[{ min: 6, message: "Password minimal 6 karakter" }]}
            >
              <Input.Password placeholder="Leave blank to keep existing password" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default CMSUserPage;
