import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';

const CMSSeries = () => {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    // Fetch series data from API or database
    setSeries([
      { id: 1, title: "Breaking Bad", genre: "Drama", releaseDate: "2008-01-20" },
      { id: 2, title: "Friends", genre: "Comedy", releaseDate: "1994-09-22" },
    ]);
  }, []);

  return (
    <Container>
      <h2>Series Management</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Genre</th>
            <th>Release Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {series.map((serie) => (
            <tr key={serie.id}>
              <td>{serie.id}</td>
              <td>{serie.title}</td>
              <td>{serie.genre}</td>
              <td>{serie.releaseDate}</td>
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

export default CMSSeries;
