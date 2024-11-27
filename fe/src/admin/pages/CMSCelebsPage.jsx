import { useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  DatePicker,
  Select,
  message,
  Typography,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import "../style/CelebsPage.css";

const { Text } = Typography;

const CMSCelebsPage = () => {
  const [actorsData, setActorsData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingActor, setEditingActor] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1, // Halaman awal
    pageSize: 10, // Jumlah item per halaman
    total: 0, // Total item dari server
  });
  

  useEffect(() => {
    fetchActors();
    fetchCountries();
  }, []);

  const fetchActors = async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/admin/actors",
        {
          params: { page, limit },
        }
      );

      setActorsData(response.data.actors);

      setPagination({
        current: page,
        pageSize: limit,
        total: response.data.meta.totalItems,
      });
    } catch (error) {
      console.error("Failed to fetch actors:", error);
      message.error("Failed to fetch actors");
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/admin/country"
      );
      setCountries(response.data);
    } catch (error) {
      console.error("Failed to fetch countries:", error);
      message.error("Failed to fetch countries");
    }
  };

  const handleEdit = (record) => {
    setEditingActor(record);
    form.setFieldsValue({
      actorName: record.name,
      birthDate: record.birthdate ? moment(record.birthdate) : null,
      countryId: record.Country?.countryId,
      biography: record.biography,
      photo: record.image,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/actors/${id}`);
      message.success("Actor deleted successfully");
      fetchActors();
    } catch (error) {
      console.error("Failed to delete actor:", error);
      message.error("Failed to delete actor");
    }
  };

  const handleSave = async (values) => {
    try {
      const payload = {
        name: values.actorName,
        birthdate: values.birthDate
          ? values.birthDate.format("YYYY-MM-DD")
          : null,
        countryId: values.countryId,
        biography: values.biography,
        image: values.photo,
      };

      if (editingActor) {
        await axios.put(
          `http://localhost:3000/api/admin/actors/${editingActor.id}`,
          payload
        );
        message.success("Actor updated successfully");
      } else {
        await axios.post("http://localhost:3000/api/admin/actors", payload);
        message.success("Actor added successfully");
      }
      fetchActors();
      setIsModalOpen(false);
      form.resetFields();
      setEditingActor(null);
    } catch (error) {
      console.error("Failed to save actor:", error);
      message.error("Failed to save actor");
    }
  };

  const handleAdd = () => {
    setEditingActor(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleShowDetails = (actor) => {
    setSelectedActor(actor);
    setIsDetailModalOpen(true);
  };

  const processedData = useMemo(
    () =>
      actorsData.map((actor, index) => ({
        key: actor.id,
        actorName: actor.name,
        country: actor.Country?.name || "Unknown",
        actorData: actor,
      })),
    [actorsData]
  );

  const columns = [
    {
      title: "No",
      key: "no",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Actor Name",
      dataIndex: "actorName",
      key: "actorName",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Detail Info",
      key: "detail",
      align: "center",
      render: (text, record) => (
        <Button
          icon={<InfoCircleOutlined />}
          onClick={() => handleShowDetails(record.actorData)}
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
            onClick={() => handleEdit(record.actorData)}
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
    <div className="actors-page">
      <div className="actors-header">
        <h2>Actors Management</h2>
        <Button type="primary" onClick={handleAdd}>
          Add New Actor
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={processedData}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page, pageSize) => fetchActors(page, pageSize),
        }}
        className="custom-table"
      />

      {/* Detail Info Modal */}
      <Modal
        title="Actor Details"
        visible={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={
          <Button onClick={() => setIsDetailModalOpen(false)}>Close</Button>
        }
      >
        {selectedActor && (
          <>
            <p>
              <strong>Name:</strong> {selectedActor.name}
            </p>
            <p>
              <strong>Birthdate:</strong>{" "}
              {selectedActor.birthdate
                ? moment(selectedActor.birthdate).format("YYYY-MM-DD")
                : "N/A"}
            </p>
            <p>
              <strong>Country:</strong>{" "}
              {selectedActor.Country?.name || "Unknown"}
            </p>
            <p>
              <strong>Biography:</strong>{" "}
              {selectedActor.biography || "No biography available"}
            </p>
            {selectedActor.image && (
              <img
                src={selectedActor.image}
                alt="actor"
                style={{ width: "100%", marginTop: "10px" }}
              />
            )}
          </>
        )}
      </Modal>

      {/* Add/Edit Actor Modal */}
      <Modal
        title={editingActor ? `Edit Actor: ${editingActor.name}` : "Add Actor"}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={form.submit}
      >
        {editingActor && (
          <div style={{ marginBottom: "20px" }}>
            <Text type="secondary">Editing actor: {editingActor.name}</Text>
          </div>
        )}
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Actor Name"
            name="actorName"
            rules={[
              { required: true, message: "Please input the actor name!" },
              { max: 100, message: "Actor name cannot exceed 100 characters" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Birth Date"
            name="birthDate"
            rules={[
              { required: true, message: "Please input the birth date!" },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            label="Country"
            name="countryId"
            rules={[{ required: true, message: "Please select the country!" }]}
          >
            <Select placeholder="Select a country">
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
          <Form.Item label="Biography" name="biography">
            <Input.TextArea rows={4} placeholder="Enter biography" />
          </Form.Item>
          <Form.Item label="Photo URL" name="photo">
            <Input placeholder="Paste photo URL here" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CMSCelebsPage;
