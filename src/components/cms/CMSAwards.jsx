import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';

const CMSAwards = () => {
  const [awards, setAwards] = useState([]);

  useEffect(() => {
    // Fetch awards data from API or database
    setAwards([
      { id: 1, name: "Best Director", year: 2024 },
      { id: 2, name: "Best Actor", year: 2023 },
    ]);
  }, []);

  return (
    <Container>
      <h2>Awards Management</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Award Name</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {awards.map((award) => (
            <tr key={award.id}>
              <td>{award.id}</td>
              <td>{award.name}</td>
              <td>{award.year}</td>
              <td>
                <Button variant="warning">Edit</Button>{' '}
                <Button variant="danger">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default CMSAwards;
