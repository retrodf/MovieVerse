import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  DatePicker,
  message,
  Select,
} from "antd";
import moment from "moment";
import { EditOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const CMSDirectorsPage = () => {
  const [directorsData, setDirectorsData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); 
  const [editingDirector, setEditingDirector] = useState(null); 
  const [viewingDirector, setViewingDirector] = useState(null); 
  const [form] = Form.useForm();

  // Fetch directors and countries data on component mount
  useEffect(() => {
    fetchDirectors();
    fetchCountries();
  }, []);

  const fetchDirectors = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/admin/directors");
      setDirectorsData(response.data.map(director => ({ ...director, key: director.id })));
    } catch (error) {
      console.error("Failed to fetch directors:", error);
      message.error("Failed to fetch directors");
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/admin/country");
      setCountries(response.data);
    } catch (error) {
      console.error("Failed to fetch countries:", error);
      message.error("Failed to fetch countries");
    }
  };

  const handleEdit = (record) => {
    setEditingDirector(record);
    form.setFieldsValue({
      name: record.name,
      birthdate: record.birthdate ? moment(record.birthdate) : null,
      countryId: record.countryId,
      biography: record.biography,
      image: record.image,
    });
    setIsModalOpen(true);
  };

  const handleViewDetails = (record) => {
    setViewingDirector(record);
    setIsDetailModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/directors/${id}`);
      message.success("Director deleted successfully");
      setDirectorsData(directorsData.filter(director => director.id !== id));
    } catch (error) {
      message.error("Failed to delete director");
    }
  };

  const handleSave = async (values) => {
    try {
      const payload = {
        name: values.name,
        birthdate: values.birthdate ? values.birthdate.format("YYYY-MM-DD") : null,
        countryId: values.countryId,
        biography: values.biography,
        image: values.image,
      };

      if (editingDirector) {
        await axios.put(`http://localhost:3000/api/admin/directors/${editingDirector.id}`, payload);
        message.success("Director updated successfully");
        fetchDirectors();
      } else {
        await axios.post("http://localhost:3000/api/admin/directors", payload);
        message.success("Director added successfully");
        fetchDirectors();
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
      render: (countryId) => {
        const country = countries.find((c) => c.countryId === countryId);
        return country ? country.name : "Unknown";
      },
    },
    {
      title: "Detail Info",
      key: "detailInfo",
      align: "center",
      render: (text, record) => (
        <Button
          icon={<InfoCircleOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          View Details
        </Button>
      ),
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
        <Button type="primary" onClick={handleAdd}>
          Add New Director
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={directorsData}
        pagination={false}
        className="custom-table"
      />

      {/* Modal for adding/editing director */}
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
            rules={[{ required: true, message: "Please input the director's name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Country"
            name="countryId"
            rules={[{ required: true, message: "Please select a country!" }]}
          >
            <Select placeholder="Select a country">
              {countries.map((country) => (
                <Option key={country.countryId} value={country.countryId}>
                  {country.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Birth Date"
            name="birthdate"
            rules={[{ required: true, message: "Please input the birth date!" }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            label="Biography"
            name="biography"
          >
            <Input.TextArea rows={4} placeholder="Enter biography" />
          </Form.Item>
          <Form.Item
            label="Image URL"
            name="image"
            rules={[{ type: "url", message: "Please enter a valid URL" }]}
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for viewing director details */}
      {viewingDirector && (
        <Modal
          title="Director Details"
          open={isDetailModalOpen}
          onCancel={() => setIsDetailModalOpen(false)}
          footer={null}
        >
          <p><strong>Name:</strong> {viewingDirector.name}</p>
          <p><strong>Country:</strong> {countries.find((c) => c.countryId === viewingDirector.countryId)?.name || "Unknown"}</p>
          <p><strong>Birthdate:</strong> {viewingDirector.birthdate ? moment(viewingDirector.birthdate).format("YYYY-MM-DD") : "No Birth Date"}</p>
          <p><strong>Biography:</strong> {viewingDirector.biography || "No Biography Available"}</p>
          {viewingDirector.image && (
            <img src={viewingDirector.image} alt="Director" style={{ width: "100%", marginTop: "10px" }} />
          )}
        </Modal>
      )}
    </div>
  );
};

export default CMSDirectorsPage;
