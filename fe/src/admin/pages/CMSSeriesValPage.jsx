import { useState } from "react";
import { Table, Button, Select, InputNumber, Space, Modal } from "antd";
import "../style/seriesValidate.css";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const CMSseriesValidate = () => {
  const [statusFilter, setStatusFilter] = useState("Unapproved");
  const [showCount, setShowCount] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedseries, setSelectedseries] = useState(null); // For storing selected series details

  const seriesData = [
    {
      key: "1",
      series: "[2024] Japan - Eye Love You",
      actors: "Takuya Kimura, Takeuchi Yuko, Neinen Reina",
      genres: "Romance, Adventures, Comedy",
      synopsis: `I love this series. It taught me a lot about money and finance. Love is not everything.
                 We need to face the reality too. Being stoic is the best.`,
      status: "Unapproved",
      otherTitles: ["Title 2", "Title 3", "Title 4"],
      year: "Spring 2024",
      rating: "3.5/5",
      availability: "Fansub: @aoisub on X",
      actorsList: ["Actor 1", "Actor 2", "Actor 3", "Actor 4", "Actor 5"],
    },
  ];

  const [dataSource, setDataSource] = useState(seriesData);

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  const handleShowCountChange = (value) => {
    setShowCount(value);
  };

  const handleApprove = (record) => {
    setSelectedseries(record); // Set the series details for the popup
    setIsModalOpen(true); // Open the popup modal
  };

  const handleDelete = (key) => {
    setDataSource(dataSource.filter((series) => series.key !== key));
  };

  const columns = [
    {
      title: "No",
      key: "no",
      align: "center",
      render: (text, record, index) => index + 1, // Using index for numbering
    },
    {
      title: "series",
      dataIndex: "series",
      key: "series",
    },
    {
      title: "Actors",
      dataIndex: "actors",
      key: "actors",
    },
    {
      title: "Genres",
      dataIndex: "genres",
    },
    {
      title: "Synopsis",
      dataIndex: "synopsis",
      key: "synopsis",
      render: (text) => (
        <div className="synopsis-cell">
          {text.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleApprove(record)} // Trigger the popup
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
    <div className="series-validate-page">
      {/* Filter Section */}
      <div className="series-validate-filters">
        <div className="filter-item">
          <span>Filtered by: </span>
          <Select
            value={statusFilter}
            onChange={handleStatusChange}
            style={{ width: 150 }}
          >
            <Option value="None">None</Option>
            <Option value="Unapproved">Unapproved</Option>
            <Option value="Approved">Approved</Option>
          </Select>
        </div>
        <div className="filter-item">
          <span>Shows: </span>
          <InputNumber
            min={1}
            max={100}
            value={showCount}
            onChange={handleShowCountChange}
          />
        </div>
      </div>

      {/* Table Section */}
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: showCount }}
        className="custom-table"
      />

      {/* series Approval Popup */}
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null} // No default footer
        width={800} // Set the width of the modal to match the design
      >
        {selectedseries && (
          <div className="series-approval-popup">
            <div className="popup-header">
              <Button type="primary" style={{ backgroundColor: "#FF7F50" }}>
                Approve
              </Button>
              <Button type="danger" style={{ marginLeft: "10px" }}>
                Delete
              </Button>
            </div>

            <div className="popup-content">
              <div className="series-info">
                <div className="series-poster-placeholder"></div> {/* Poster placeholder */}
                <div className="series-details">
                  <h2>{selectedseries.series}</h2>
                  <p>Other titles: {selectedseries.otherTitles.join(", ")}</p>
                  <p>Year: {selectedseries.year}</p>
                  <p>{selectedseries.synopsis}</p>
                  <p>Genres: {selectedseries.genres}</p>
                  <p>Rating: {selectedseries.rating}</p>
                  <p>Availability: {selectedseries.availability}</p>
                </div>
              </div>

              <div className="actors-list">
                {selectedseries.actorsList.map((actor, index) => (
                  <div key={index} className="actor-item">
                    {actor}
                  </div>
                ))}
              </div>

              <div className="trailer-placeholder">
                {/* Placeholder for trailer */}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CMSseriesValidate;
