import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SidebarComponent from '../components/SidebarComponent';
import NavbarComponent from '../components/NavbarComponent';
import CMSFilter from '../components/cms/CMSFilter';  // Sesuaikan ini untuk halaman CMS yang lain

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <NavbarComponent />
      <Row>
        <Col md={2} className="sidebar">
          <SidebarComponent />
        </Col>
        <Col md={10} className="content">
          <Container>
            <CMSFilter />  {/* Sesuaikan halaman CMS di sini */}
          </Container>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
