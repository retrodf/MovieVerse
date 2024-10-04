import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Upload,
  Checkbox,
  Row,
  Col,
  InputNumber,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import "../style/InputSeriesPage.css"; // Tambahkan file CSS

const { Option } = Select;

const CMSInputNewSeries = () => {
  const [form] = Form.useForm();
  const [countries, setCountries] = useState([]);
  const [genres, setGenres] = useState([]);
  const [actors, setActors] = useState([]);
  const [awards, setAwards] = useState([]);

  // Fetch data for countries, genres, actors, awards from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/cms/countries")
      .then((response) => setCountries(response.data))
      .catch((error) => console.error("Failed to fetch countries:", error));

    axios
      .get("http://localhost:5000/cms/genres")
      .then((response) => setGenres(response.data))
      .catch((error) => console.error("Failed to fetch genres:", error));

    axios
      .get("http://localhost:5000/cms/actors")
      .then((response) => setActors(response.data))
      .catch((error) => console.error("Failed to fetch actors:", error));

    axios
      .get("http://localhost:5000/cms/awards")
      .then((response) => setAwards(response.data))
      .catch((error) => console.error("Failed to fetch awards:", error));
  }, []);

  const handleSave = async (values) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("country", values.country);
      formData.append("releaseDate", values.releaseDate.format("YYYY-MM-DD"));
      formData.append("season", values.season);
      formData.append("episodes", values.episodes);
      formData.append("duration", values.duration);
      formData.append("synopsis", values.synopsis);
      formData.append("genres", values.genres.join(",")); // Mengirimkan genres sebagai string dipisahkan koma
      if (values.poster && values.poster[0]) {
        formData.append("poster", values.poster[0].originFileObj);
      }
      formData.append("trailerLink", values.trailerLink);
      formData.append("award", values.award);
      formData.append("actors", values.actors.join(",")); // Mengirimkan actors sebagai string dipisahkan koma

      // Kirim data ke backend
      await axios.post("http://localhost:5000/cms/series-input", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Series created successfully!");
      form.resetFields(); // Reset form setelah submit
    } catch (error) {
      message.error("Failed to create series.");
    }
  };

  return (
    <div className="input-series-page">
      <div className="input-series-header">
        <h2>Input New Series</h2>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{ genres: [], actors: [] }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Title"
              name="title"
              rules={[
                { required: true, message: "Please input the series title!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
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
          </Col>
          <Col span={8}>
            <Form.Item
              label="Release Date"
              name="releaseDate"
              rules={[
                { required: true, message: "Please select a release date!" },
              ]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Season"
              name="season"
              rules={[
                { required: true, message: "Please input the season number!" },
              ]}
            >
              <InputNumber min={1} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Episodes"
              name="episodes"
              rules={[
                {
                  required: true,
                  message: "Please input the number of episodes!",
                },
              ]}
            >
              <InputNumber min={1} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Duration per Episode (minutes)"
              name="duration"
              rules={[
                {
                  required: true,
                  message: "Please input the duration per episode!",
                },
              ]}
            >
              <InputNumber min={1} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Synopsis"
          name="synopsis"
          rules={[{ required: true, message: "Please input the synopsis!" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Genres"
          name="genres"
          rules={[
            { required: true, message: "Please select at least one genre!" },
          ]}
        >
          <Checkbox.Group>
            <Row>
              {genres.map((genre) => (
                <Col span={6} key={genre.id}>
                  <Checkbox value={genre.id}>{genre.name}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
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

        <Form.Item label="Award" name="award">
          <Select>
            {awards.map((award) => (
              <Option key={award.id} value={award.id}>
                {award.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Celebs (Actors) Section */}
        <Form.Item
          label="Actors"
          name="actors"
          rules={[
            { required: true, message: "Please select at least one actor!" },
          ]}
        >
          <Select mode="multiple" placeholder="Select actors">
            {actors.map((actor) => (
              <Option key={actor.id} value={actor.id}>
                {actor.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CMSInputNewSeries;
