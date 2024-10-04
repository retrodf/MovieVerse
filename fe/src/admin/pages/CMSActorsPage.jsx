import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, Space, DatePicker, message } from "antd";
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
    axios
      .get("http://localhost:5000/api/actors")
      .then((response) => {
        setActorsData(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch actors:", error);
        message.error("Failed to fetch actors");
      });

    axios
      .get("http://localhost:5000/api/countries")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch countries:", error);
      });
  }, []);

  const handleAdd = () => {
    setEditingActor(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSave = async (values) => {
    const formData = {
      ...values,
      birthDate: values.birthDate ? values.birthDate.format("YYYY-MM-DD") : null,
    };

    if (editingActor) {
      await axios.put(`http://localhost:5000/api/actors/${editingActor.id}`, formData);
    } else {
      await axios.post("http://localhost:5000/api/actors", formData);
    }

    // Refresh actor data
    axios.get("http://localhost:5000/api/actors").then((response) => {
      setActorsData(response.data);
    });

    setIsModalOpen(false);
    form.resetFields();
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
      dataIndex: "birthDate",
      key: "birthDate",
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
            onClick={() => setEditingActor(record)}
          />
          <Button type="danger" icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd}>
        Add New Actor
      </Button>
      <Table columns={columns} dataSource={actorsData} pagination={false} />

      <Modal
        title={editingActor ? "Edit Actor" : "Add Actor"}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={form.submit}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please input name!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Country" name="countryId" rules={[{ required: true, message: "Please select country!" }]}>
            <Select>
              {countries.map((country) => (
                <Option key={country.countryId} value={country.countryId}>
                  {country.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Birth Date" name="birthDate">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="Biography" name="biography">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CMSActorsPage;