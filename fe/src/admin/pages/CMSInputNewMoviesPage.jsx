import { Form, Input, Button, DatePicker, Select, Upload, Checkbox, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import "../style/InputMoviesPage.css"; // Tambahkan file CSS

const { Option } = Select;

const CMSInputNewMovies = () => {
  const [form] = Form.useForm();

  const handleSave = (values) => {
    console.log('Form values: ', values);
    form.resetFields(); // Reset form setelah submit
  };

  return (
    <div className="input-movies-page">
      <div className="input-movies-header">
        <h2>Input New Movie</h2>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{ genres: [] }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Please input the movie title!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Country"
              name="country"
              rules={[{ required: true, message: 'Please select a country!' }]}
            >
              <Select>
                <Option value="Japan">Japan</Option>
                <Option value="Korea">Korea</Option>
                <Option value="China">China</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Release Date"
              name="releaseDate"
              rules={[{ required: true, message: 'Please select a release date!' }]}
            >
              <DatePicker format="DD MMMM YYYY" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Synopsis"
          name="synopsis"
          rules={[{ required: true, message: 'Please input the synopsis!' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Genres"
          name="genres"
          rules={[{ required: true, message: 'Please select at least one genre!' }]}
        >
          <Checkbox.Group>
            <Row>
              <Col span={6}><Checkbox value="Adventure">Adventure</Checkbox></Col>
              <Col span={6}><Checkbox value="Romance">Romance</Checkbox></Col>
              <Col span={5}><Checkbox value="Drama">Drama</Checkbox></Col>
              <Col span={6}><Checkbox value="Slice of Life">Horror</Checkbox></Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          label="Upload Poster"
          name="poster"
          valuePropName="fileList"
          getValueFromEvent={(e) => e && e.fileList}
        >
          <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Upload Poster</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Link Trailer"
          name="trailerLink"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Award"
          name="award"
        >
          <Select>
            <Option value="Japanese Drama Awards Spring 2024">Japanese Drama Awards Spring 2024</Option>
            <Option value="Korean Drama Awards Summer 2024">Korean Drama Awards Summer 2024</Option>
          </Select>
        </Form.Item>

        {/* Celebs (Actors) Section */}
        <Form.Item
          label="Actors"
          name="actors"
          rules={[{ required: true, message: 'Please select at least one actor!' }]}
        >
          <Select mode="multiple" placeholder="Select actors">
            <Option value="Takuya Kimura">Takuya Kimura</Option>
            <Option value="Yuko Takeuchi">Yuko Takeuchi</Option>
            <Option value="Song Hye Kyo">Song Hye Kyo</Option>
            <Option value="Lee Min Ho">Lee Min Ho</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CMSInputNewMovies;
