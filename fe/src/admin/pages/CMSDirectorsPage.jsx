import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, DatePicker, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import "../style/CelebsPage.css"; // Pastikan file CSS sesuai

const CMSDirectorsPage = () => {
  const [directorsData, setDirectorsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDirector, setEditingDirector] = useState(null);
  const [form] = Form.useForm();

  // Load directors from backend
  useEffect(() => {
    axios.get("http://localhost:5000/cms/directors")
      .then(response => setDirectorsData(response.data))
      .catch(error => console.error("Failed to fetch directors:", error));
  }, []);

  const handleEdit = (record) => {
    setEditingDirector(record);
    form.setFieldsValue({
      ...record,
      birthdate: record.birthdate ? record.birthdate : null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/cms/directors/${id}`);
      message.success("Director deleted successfully");
      setDirectorsData(directorsData.filter(director => director.id !== id));
    } catch (error) {
      message.error("Failed to delete director");
    }
  };

  const handleSave = async (values) => {
    try {
      const formData = {
        ...values,
        birthdate: values.birthdate.format("YYYY-MM-DD"),
      };

      if (editingDirector) {
        await axios.put(`http://localhost:5000/cms/directors/${editingDirector.id}`, formData);
        setDirectorsData(directorsData.map(director => director.id === editingDirector.id ? { ...director, ...values } : director));
        message.success("Director updated successfully");
      } else {
        const response = await axios.post("http://localhost:5000/cms/directors", formData);
        setDirectorsData([...directorsData, { ...response.data, key: response.data.id }]);
        message.success("Director added successfully");
      }

      setIsModalOpen(false);
      setEditingDirector(null);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save director");
    }
  };

  const handleAdd = () => {
    setEditingDirector(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "No",
      key: "no",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Country",
      dataIndex: "countryId",
      key: "countryId",
    },
    {
      title: "Birth Date",
      dataIndex: "birthdate",
      key: "birthdate",
    },
    {
      title: "Biography",
      dataIndex: "biography",
      key: "biography",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
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
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="directors-page">
      <div className="directors-header">
        <h2>Directors Management</h2>
        <Button type="primary" onClick={handleAdd}>Add New Director</Button>
      </div>
      <Table columns={columns} dataSource={directorsData} pagination={false} className="custom-table" />

      <Modal
        title={editingDirector ? "Edit Director" : "Add Director"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={form.submit}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the director name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Country"
            name="countryId"
            rules={[{ required: true, message: "Please input the country!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Birth Date"
            name="birthdate"
            rules={[{ required: true, message: "Please input the birth date!" }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="Biography"
            name="biography"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CMSDirectorsPage;
