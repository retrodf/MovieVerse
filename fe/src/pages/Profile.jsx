import React, { useState } from "react";
import { Container, Row, Col, Nav, Tab, Card } from "react-bootstrap";
import "../styles/Profile.css"; // Sesuaikan dengan style Anda

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="profile-page-container">
      <Row>
        <Col md={3} className="sidebar">
          {/* Sidebar */}
          <h2>Menu</h2>
          <ul className="menu-list">
            <li>Home</li>
          </ul>
          <h4>General</h4>
          <ul className="menu-list">
            <li>Settings</li>
            <li>Log Out</li>
          </ul>
        </Col>
        <Col md={9}>
          <Tab.Container defaultActiveKey="details">
            <Nav variant="tabs" className="justify-content-start mb-4">
              <Nav.Item>
                <Nav.Link
                  eventKey="details"
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="security"
                  onClick={() => setActiveTab("security")}
                >
                  Password & Security
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              {/* Tab Konten: Details */}
              <Tab.Pane eventKey="details">
                <Card className="p-4 bg-dark rounded-3">
                  <h4>Info</h4>
                  <Row>
                    <Col md={4}>
                      <img
                        src="https://via.placeholder.com/150"
                        alt="User"
                        className="rounded-circle"
                        style={{ width: "100px" }}
                      />
                    </Col>
                    <Col md={8}>
                      <p>
                        <strong>First Name:</strong> Mary
                      </p>
                      <p>
                        <strong>Middle Name:</strong> Jane
                      </p>
                      <p>
                        <strong>Last Name:</strong> Doe
                      </p>
                      <p>
                        <strong>Email:</strong> maryjane@yahoo.com
                      </p>
                      <p>
                        <strong>Phone:</strong> 9813011420
                      </p>
                    </Col>
                  </Row>
                  <hr />
                  <h4>Plan Details</h4>
                  <p>
                    <strong>Standard:</strong> HD
                  </p>
                  <p>
                    <strong>Joined on:</strong> June 25, 2021
                  </p>
                </Card>
              </Tab.Pane>

              {/* Tab Konten: Password & Security */}
              <Tab.Pane eventKey="security">
                <Card className="p-4 bg-dark rounded-3">
                  <h4>Password & Security</h4>
                  <p>Password last updated on: March 12, 2024</p>
                  <button className="btn btn-danger">Change Password</button>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
