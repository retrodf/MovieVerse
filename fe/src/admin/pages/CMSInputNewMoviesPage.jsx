import { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, message } from "antd";
import axios from "axios";

const { Option } = Select;

const CMSInputNewMoviesPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [directors, setDirectors] = useState([]);

  // Load countries and directors
  useEffect(() => {
    axios.get('http://localhost:5000/cms/countries')
      .then(response => setCountries(response.data))
      .catch(error => message.error('Failed to fetch countries'));

    axios.get('http://localhost:5000/cms/directors')
      .then(response => setDirectors(response.data))
      .catch(error => message.error('Failed to fetch directors'));
  }, []);

  const handleSave = async (values) => {
    try {
      setLoading(true);

      const formData = {
        ...values,
        // Format release_date properly
        release_date: values.release_date ? values.release_date.format('YYYY-MM-DD') : null,
        // If rating is not provided, send null
        rating: values.rating || null,
      };

      await axios.post('http://localhost:5000/cms/movies-input', formData);
      message.success("Movie successfully added!");
      form.resetFields();
    } catch (error) {
      message.error("Failed to add movie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="input-movies-page">
      <h2>Input New Movie</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input the movie title!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Country"
          name="countryId"
          rules={[{ required: true, message: "Please select a country!" }]}
        >
          <Select>
            {countries.map(country => (
              <Option key={country.countryId} value={country.countryId}>
                {country.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Director"
          name="directorId"
          rules={[{ required: true, message: "Please select a director!" }]}
        >
          <Select>
            {directors.map(director => (
              <Option key={director.id} value={director.id}>
                {director.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Rating (Optional)"
          name="rating"
        >
          <Input type="number" min="0" max="10" placeholder="Enter rating between 0-10" />
        </Form.Item>

        <Form.Item
          label="Release Date"
          name="release_date"
          rules={[{ required: true, message: "Please select the release date!" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="Synopsis"
          name="synopsis"
          rules={[{ required: true, message: "Please input the synopsis!" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Poster URL"
          name="poster_url"
          rules={[{ required: true, message: "Please input the poster URL!" }]}
        >
          <Input placeholder="https://example.com/poster.jpg" />
        </Form.Item>

        <Form.Item
          label="Trailer URL"
          name="trailer_url"
        >
          <Input placeholder="https://youtube.com/trailer" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CMSInputNewMoviesPage;
