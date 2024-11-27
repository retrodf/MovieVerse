import { useState, useEffect } from "react";
import { Table, Button, Select, InputNumber, message, Space } from "antd";
import { DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import axios from "axios";
import { URL } from "../../utils";
import "../style/CommentsPage.css";

const { Option } = Select;

const CMSComments = () => {
  const [statusFilter, setStatusFilter] = useState("None");
  const [showCount, setShowCount] = useState(10);
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch comments data from backend
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${URL}/reviews`);
        console.log("Fetched comments data:", response.data);
        setDataSource(response.data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, []);

  // Handle filter change
  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  // Handle show count change
  const handleShowCountChange = (value) => {
    setShowCount(value);
  };

  // Approve a single comment by id
  const handleApprove = async (commentId) => {
    try {
      await axios.put(`${URL}/reviews/${commentId}/approve`);
      setDataSource((prevDataSource) =>
        prevDataSource.map((comment) =>
          comment.id === commentId
            ? { ...comment, status: "Approved" }
            : comment
        )
      );
      message.success("Comment approved successfully");
    } catch (error) {
      message.error("Failed to approve comment");
      console.error("Failed to approve comment:", error);
    }
  };

  // Delete a single comment by id
  const handleDeleteSingle = async (commentId) => {
    try {
      await axios.delete(`${URL}/reviews/${commentId}`);
      setDataSource((prevDataSource) =>
        prevDataSource.filter((comment) => comment.id !== commentId)
      );
      message.success("Comment deleted successfully");
    } catch (error) {
      message.error("Failed to delete comment");
      console.error("Failed to delete comment:", error);
    }
  };

  // Define table columns with rating formatted as x/10
  const columns = [
    {
      title: "No",
      key: "no",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Username",
      dataIndex: ["User", "username"],
      key: "username",
    },
    {
      title: "Rate",
      dataIndex: "rating",
      key: "rating",
      align: "center",
      render: (rating) => `${rating}/10`,
    },
    {
      title: "Movie",
      dataIndex: ["Movie", "title"],
      key: "movie",
    },
    {
      title: "Comments",
      dataIndex: "content",
      key: "content",
      render: (text) => (
        <div className="comment-cell">
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
      align: "center",
      render: (status) =>
        status === "Approved" ? (
          <span style={{ color: "green", fontWeight: "bold" }}>Approved</span>
        ) : (
          <span style={{ color: "red", fontWeight: "bold" }}>Unapproved</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record.id)}
            disabled={record.status === "Approved"}
            style={{
              backgroundColor:
                record.status === "Approved" ? "#d3d3d3" : "#4CAF50",
              color: "white",
              border: "none",
            }}
          />
          <Button
          className="ant-btn-delete"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteSingle(record.id)}
            style={{
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
            }}
          />
        </Space>
      ),
    },
  ];

  // Filter data source based on status filter
  const filteredData = dataSource.filter((comment) =>
    statusFilter === "None" ? true : comment.status === statusFilter
  );

  return (
    <div className="comments-page">
      <div className="user-header">
        <h2>Comment Management</h2>
        {/* Filter Section */}
        <div className="comments-filters">
          <div className="filter-item">
            <span>Filtered by: </span>
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
              style={{ width: 150 }}
            >
              <Option value="None">None</Option>
              <Option value="Approved">Approved</Option>
              <Option value="Unapproved">Unapproved</Option>
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
      </div>

      {/* Table Section */}
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: showCount }}
        rowKey={(record) => record.id}
        className="custom-table"
        loading={isLoading}
      />
    </div>
  );
};

export default CMSComments;
