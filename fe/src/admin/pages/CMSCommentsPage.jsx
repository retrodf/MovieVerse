import { useState } from "react";
import { Table, Button, Select, Checkbox, Rate,  InputNumber, } from "antd";
import "../style/CommentsPage.css"; // Jangan lupa buat file CSS-nya

const { Option } = Select;

const CMSComments = () => {
  const [statusFilter, setStatusFilter] = useState("None");
  const [showCount, setShowCount] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);

  const commentsData = [
    {
      key: "1",
      username: "Nara",
      rate: 5,
      drama: "[2024] Japan - Eye Love You",
      comment:
        "I love this drama. It taught me a lot about money and finance. Love is not everything. We need to face the reality too. Being stoic is the best. What the most thing that I love is about the kindness. Having money is perfect.",
      status: "Unapproved",
    },
    {
      key: "2",
      username: "Luffy",
      rate: 2,
      drama: "[2024] Japan - Eye Love You",
      comment: "Meh",
      status: "Approved",
    },
  ];

  const [dataSource, setDataSource] = useState(commentsData);

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  const handleShowCountChange = (value) => {
    setShowCount(value);
  };

  const handleApprove = () => {
    setDataSource(
      dataSource.map((comment) =>
        selectedRows.includes(comment.key)
          ? { ...comment, status: "Approved" }
          : comment
      )
    );
    setSelectedRows([]);
  };

  const handleDelete = () => {
    setDataSource(
      dataSource.filter((comment) => !selectedRows.includes(comment.key))
    );
    setSelectedRows([]);
  };

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRows(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      align: "center",
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      align: "center",
      render: (rate) => <Rate disabled defaultValue={rate} />,
    },
    {
      title: "Drama",
      dataIndex: "drama",
      key: "drama",
      align: "center",
    },
    {
      title: "Comments",
      dataIndex: "comment",
      key: "comment",
      align: "center",
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
    },
  ];

  return (
    <div className="comments-page">
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

      {/* Table Section */}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: showCount }}
        className="custom-table"
      />

      {/* Action Buttons */}
      <div className="comments-actions">
        <Checkbox
          checked={selectedRows.length === dataSource.length}
          onChange={() => {
            if (selectedRows.length === dataSource.length) {
              setSelectedRows([]);
            } else {
              setSelectedRows(dataSource.map((comment) => comment.key));
            }
          }}
        >
          Select All
        </Checkbox>
        <Button
          type="primary"
          onClick={handleApprove}
          disabled={selectedRows.length === 0}
          style={{ marginLeft: 10 }}
        >
          Approve
        </Button>
        <Button
          type="danger"
          onClick={handleDelete}
          disabled={selectedRows.length === 0}
          style={{ marginLeft: 10 }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default CMSComments;
