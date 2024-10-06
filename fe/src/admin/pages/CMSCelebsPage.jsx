import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Upload, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import "../style/CelebsPage.css";  // Jangan lupa buat file CSS-nya

const CMSActors = () => {
  const [actorsData, setActorsData] = useState([
    {
      key: '1',
      country: 'Japan',
      actorName: 'Takuya Kimura',
      birthDate: '19 Desember 1975',
      photo: '',
    },
    {
      key: '2',
      country: 'Japan',
      actorName: 'Yuko Takeuchi',
      birthDate: '19 Oktober 1977',
      photo: '',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActor, setEditingActor] = useState(null);
  const [form] = Form.useForm();

  const handleEdit = (record) => {
    setEditingActor(record);
    form.setFieldsValue({
      ...record,
      birthDate: record.birthDate ? record.birthDate : null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (key) => {
    setActorsData(actorsData.filter(actor => actor.key !== key));
  };

  const handleSave = (values) => {
    if (editingActor) {
      setActorsData(
        actorsData.map(actor =>
          actor.key === editingActor.key ? { ...actor, ...values } : actor
        )
      );
    } else {
      const newActor = {
        key: `${actorsData.length + 1}`,
        ...values,
      };
      setActorsData([...actorsData, newActor]);
    }
    setIsModalOpen(false);
    setEditingActor(null);
    form.resetFields();
  };

  const handleAdd = () => {
    setEditingActor(null);
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
      title: 'Actor Name',
      dataIndex: 'actorName',
      key: 'actorName',
    },
    {
      title: 'Birth Date',
      dataIndex: 'birthDate',
      key: 'birthDate',
    },
    {
      title: 'Photos',
      dataIndex: 'photo',
      key: 'photo',
      render: (text) => (
        text ? <img src={text} alt="actor" style={{ width: '50px', height: '50px' }} /> : 'No Image'
      ),
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
    <div className="actors-page">
      <div className="actors-header">
        <h2>Actors Management</h2>
        <Button type="primary" onClick={handleAdd}>Add New Actor</Button>
      </div>
      <Table columns={columns} dataSource={actorsData} pagination={false} className="custom-table" />

      <Modal
        title={editingActor ? 'Edit Actor' : 'Add Actor'}
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
            label="Actor Name"
            name="actorName"
            rules={[{ required: true, message: 'Please input the actor name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Birth Date"
            name="birthDate"
            rules={[{ required: true, message: 'Please input the birth date!' }]}
          >
            <DatePicker format="DD MMMM YYYY" />
          </Form.Item>
          <Form.Item
            label="Upload Picture"
            name="photo"
            valuePropName="fileList"
            getValueFromEvent={(e) => e && e.fileList}
          >
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}  // Prevent auto-upload
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CMSActors;
