import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Radio } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios'; // Tambahkan axios untuk HTTP request
import "../style/CountriesPage.css";  // Jangan lupa buat file CSS-nya

const CMSCountries = () => {
  const [countriesData, setCountriesData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [loading, setLoading] = useState(true); // Tambahkan loading state
  const [form] = Form.useForm();

// Fetch data dari backend
useEffect(() => {
  const fetchCountries = async () => {
    try {
      const response = await axios.get('http://localhost:8000/cms/countries');
      setCountriesData(
        response.data.map((country) => ({
          key: country.country_id,  // Gunakan country_id sebagai key
          country: country.name,  // Tampilkan nama negara
          isDefault: country.is_default === 1 ? true : false  // Konversi flag is_default
        }))
      );
      setLoading(false);  // Set loading ke false setelah data diterima
    } catch (error) {
      console.error('Error fetching country', error);
      setLoading(false);  // Set loading ke false jika ada error
    }
  };

  fetchCountries();  // Memanggil fungsi fetch
}, []);

  const handleEdit = (record) => {
    setEditingCountry(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (key) => {
    setCountriesData(countriesData.filter(country => country.key !== key));
  };

  const handleSave = (values) => {
    // Jika ada country default, hapus flag default pada semua negara
    if (values.isDefault) {
      setCountriesData(countriesData.map(country => ({
        ...country,
        isDefault: false,
      })));
    }

    if (editingCountry) {
      setCountriesData(
        countriesData.map(country =>
          country.key === editingCountry.key ? { ...country, ...values } : country
        )
      );
    } else {
      const newCountry = {
        key: `${countriesData.length + 1}`,
        ...values,
      };
      setCountriesData([...countriesData, newCountry]);
    }
    setIsModalOpen(false);
    setEditingCountry(null);
    form.resetFields();
  };

  const handleAdd = () => {
    setEditingCountry(null);
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
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Default',
      dataIndex: 'isDefault',
      key: 'isDefault',
      align: 'center',
      render: (isDefault) => (isDefault ? '✔' : ''),
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
    <div className="countries-page">
      <div className="countries-header">
        <h2>Countries Management</h2>
        <Button type="primary" onClick={handleAdd}>Add New Country</Button>
      </div>
      <Table columns={columns} dataSource={countriesData} pagination={false} loading={loading} className="custom-table" />

      <Modal
        title={editingCountry ? 'Edit Country' : 'Add Country'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={form.submit}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: 'Please input the country name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Set as Default"
            name="isDefault"
            valuePropName="checked"
          >
            <Radio.Group>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CMSCountries;
