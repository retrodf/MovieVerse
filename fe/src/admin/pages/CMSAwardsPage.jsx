import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import "../style/AwardsPage.css"; // CSS khusus untuk Awards

const CMSAwards = () => {
  const [awardsData, setAwardsData] = useState([
    {
      key: '1',
      country: 'Japan',
      year: '2024',
      award: 'Japan ese Drama Awards Spring 2024',
    },
    {
      key: '2',
      country: 'Japan',
      year: '2024',
      award: 'Japanese Drama Awards Spring 2024',
    },
    {
      key: '3',
      country: 'Korea',
      year: '2024',
      award: 'Korean Drama Awards Summer 2024',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAward, setEditingAward] = useState(null);
  const [form] = Form.useForm();

  const handleEdit = (record) => {
    setEditingAward(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (key) => {
    setAwardsData(awardsData.filter(award => award.key !== key));
  };

  const handleSave = (values) => {
    if (editingAward) {
      setAwardsData(awardsData.map(award => (award.key === editingAward.key ? { ...award, ...values } : award)));
    } else {
      const newAward = {
        key: `${awardsData.length + 1}`,
        ...values,
      };
      setAwardsData([...awardsData, newAward]);
    }
    setIsModalOpen(false);
    setEditingAward(null);
    form.resetFields();
  };

  const handleAdd = () => {
    setEditingAward(null);
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
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Award',
      dataIndex: 'award',
      key: 'award',
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
    <div className="awards-page">
      <div className="awards-header">
        <h2>Awards Management</h2>
        <Button type="primary" onClick={handleAdd}>Add New Award</Button>
      </div>
      <Table columns={columns} dataSource={awardsData} pagination={false} className="custom-table" />

      <Modal
        title={editingAward ? 'Edit Award' : 'Add Award'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={form.submit}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: 'Please input the country!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Year"
            name="year"
            rules={[{ required: true, message: 'Please input the year!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Award"
            name="award"
            rules={[{ required: true, message: 'Please input the award!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CMSAwards;
