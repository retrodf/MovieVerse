import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, message, InputNumber } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { URL } from "../../utils";
import "../style/CountriesPage.css";

const CMSCountries = () => {
  const [countriesData, setCountriesData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCount, setShowCount] = useState(10);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [form] = Form.useForm();

  // Fetch data dari backend
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${URL}/admin/country`);
      setCountriesData(
        response.data.map((country) => ({
          key: country.countryId,
          country: country.name,
        }))
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching countries:", error);
      message.error("Failed to fetch countries");
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingCountry(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (countryId) => {
    try {
      await axios.delete(`${URL}/admin/country/${countryId}`);
      message.success("Country deleted successfully");
      fetchCountries();
    } catch (error) {
      console.error("Error deleting country:", error);
      message.error("Failed to delete country");
    }
  };

  const handleSave = async (values) => {
    try {
      if (editingCountry) {
        await axios.put(`${URL}/admin/country/${editingCountry.key}`, {
          name: values.country,
        });
        message.success("Country updated successfully");
      } else {
        await axios.post("`${URL}/admin/country`", {
          name: values.country,
        });
        message.success("Country added successfully");
      }
      fetchCountries();
      setIsModalOpen(false);
      setEditingCountry(null);
      form.resetFields();
    } catch (error) {
      console.error("Error saving country:", error);
      message.error("Failed to save country");
    }
  };

  const handleAdd = () => {
    setEditingCountry(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleShowCountChange = (value) => {
    setShowCount(value);
    setPagination({ ...pagination, pageSize: value });
  };

  const columns = [
    {
      title: "No",
      key: "no",
      align: "center",
      render: (text, record, index) =>
        index + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
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
            className="ant-btn-delete"
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
        <div className="controls">
          <div className="filter-item">
            <span>Show:</span>
            <InputNumber
              min={1}
              max={100}
              value={showCount}
              onChange={handleShowCountChange}
            />
          </div>
          <Button className="ant-btn-new-country" onClick={handleAdd}>
            + New Country
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={countriesData}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
        }}
        loading={loading}
        className="custom-table"
        rowKey={(record) => record.key}
      />

      {/* Modal for adding/editing country */}
      <Modal
        title={editingCountry ? "Edit Country" : "Add Country"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={form.submit}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: "Please input the country name!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CMSCountries;
