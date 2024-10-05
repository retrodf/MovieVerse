import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import "../style/CountriesPage.css";

const CMSCountriesPage = () => {
  const [countriesData, setCountriesData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  // Fetch data dari backend
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("http://localhost:5000/cms/countries");  // URL disesuaikan dengan route BE
        setCountriesData(
          response.data.map((country) => ({
            key: country.countryId,  // Disesuaikan dengan field countryId dari API
            country: country.name,   // Disesuaikan dengan field name dari API
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleEdit = (record) => {
    setEditingCountry(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (key) => {
    try {
      await axios.delete(`http://localhost:5000/cms/countries/${key}`);
      message.success("Country deleted successfully");
      setCountriesData(countriesData.filter((country) => country.key !== key));
    } catch (error) {
      message.error("Failed to delete country");
    }
  };

  const handleSave = async (values) => {
    try {
      if (editingCountry) {
        // Jika sedang mengedit
        await axios.put(`http://localhost:5000/cms/countries/${editingCountry.key}`, values);
        setCountriesData(
          countriesData.map((country) =>
            country.key === editingCountry.key ? { ...country, ...values } : country
          )
        );
        message.success("Country updated successfully");
      } else {
        // Jika menambahkan negara baru
        const response = await axios.post("http://localhost:5000/cms/countries", values);
        setCountriesData([
          ...countriesData,
          { ...response.data, key: response.data.id },  // Sesuaikan dengan response BE
        ]);
        message.success("Country added successfully");
      }

      setIsModalOpen(false);
      setEditingCountry(null);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save country");
    }
  };

  const handleAdd = () => {
    setEditingCountry(null);
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
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (country) => country || "Unknown",
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
            onClick={() => handleDelete(record.key)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="countries-page">
      <div className="countries-header">
        <h2>Countries Management</h2>
        <Button type="primary" onClick={handleAdd}>
          Add New Country
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={countriesData}
        pagination={false}
        loading={loading}
        className="custom-table"
      />

      <Modal
        title={editingCountry ? "Edit Country" : "Add Country"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={form.submit}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Country Name"
            name="name"
            rules={[{ required: true, message: "Please input the country name!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CMSCountriesPage;
