import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';

const CMSSeriesApproved = () => {
  const [approvedSeries, setApprovedSeries] = useState([]);

  useEffect(() => {
    // Fetch approved series data from API or database
    setApprovedSeries([
      { id: 1, title: "Breaking Bad", status: "Approved" },
      { id: 2, title: "Friends", status: "Approved" },
    ]);
  }, []);

  return (
    <Container>
      <h2>Approved Series Management</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {approvedSeries.map((serie) => (
            <tr key={serie.id}>
              <td>{serie.id}</td>
              <td>{serie.title}</td>
              <td>{serie.status}</td>
              <td>
                <Button variant="danger">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default CMSSeriesApproved;
