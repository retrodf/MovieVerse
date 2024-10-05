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
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const CMSActorsPage = () => {
  const [actorsData, setActorsData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActor, setEditingActor] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Fetch actors data
    axios
    .get("http://localhost:5000/cms/actors")
    .then((response) => {
      console.log(response.data);  // Lihat data di console, apakah ada buffer
      setActorsData(response.data);
    })
    .catch((error) => {
      console.error("Failed to fetch actors:", error);
      message.error("Failed to fetch actors");
    });

    // Fetch countries data
    axios
      .get("http://localhost:5000/cms/countries")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch countries:", error);
      });
  }, []);

  const handleEdit = (record) => {
    setEditingActor(record);
    form.setFieldsValue({
      ...record,
      birthdate: record.birthdate ? moment(record.birthdate) : null, // Konversi ke moment.js jika ada nilai birthdate
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/cms/actors/${id}`);
      message.success("Actor deleted successfully");
      setActorsData(actorsData.filter((actor) => actor.id !== id));
    } catch (error) {
      message.error("Failed to delete actor");
    }
  };

  const handleSave = async (values) => {
    const formData = {
      ...values,
      birthdate: values.birthdate
        ? values.birthdate.format("YYYY-MM-DD")
        : null, // Konversi moment ke format string untuk dikirim ke backend
    };

    try {
      if (editingActor) {
        await axios.put(
          `http://localhost:5000/cms/actors/${editingActor.id}`,
          formData
        );
        setActorsData(
          actorsData.map((actor) =>
            actor.id === editingActor.id ? { ...actor, ...values } : actor
          )
        );
        message.success("Actor updated successfully");
      } else {
        const response = await axios.post(
          "http://localhost:5000/cms/actors",
          formData
        );
        setActorsData([
          ...actorsData,
          { ...response.data, key: response.data.id },
        ]);
        message.success("Actor added successfully");
      }
      setIsModalOpen(false);
      setEditingActor(null);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save actor");
    }
  };

  const handleAdd = () => {
    setEditingActor(null);
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
      render: (name) => name || "No Name", // Fallback jika name kosong
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (country) => country || "Unknown", // Gunakan country name yang diambil dari join query
    },
    {
      title: "Birth Date",
      dataIndex: "birthdate",
      key: "birthdate",
      render: (birthdate) =>
        birthdate ? new Date(birthdate).toLocaleDateString() : "No Birth Date", // Format tanggal
    },
    {
      title: "Biography",
      dataIndex: "biography",
      key: "biography",
      render: (biography) => biography || "No Biography", // Fallback jika biography kosong
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
    <div className="actors-page">
      <div className="actors-header">
        <h2>Actors Management</h2>
        <Button type="primary" onClick={handleAdd}>
          Add New Actor
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={actorsData}
        pagination={false}
        className="custom-table"
      />

      <Modal
        title={editingActor ? "Edit Actor" : "Add Actor"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={form.submit}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the actor name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Country"
            name="countryId"
            rules={[{ required: true, message: "Please select a country!" }]}
          >
            <Select>
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
            <DatePicker />
          </Form.Item>

          <Form.Item label="Biography" name="biography">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CMSActorsPage;
