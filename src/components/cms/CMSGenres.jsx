import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';

const CMSGenres = () => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    // Fetch genres data from API or database
    setGenres([
      { id: 1, name: "Action" },
      { id: 2, name: "Romance" },
      { id: 3, name: "Sci-Fi" },
    ]);
  }, []);

  return (
    <Container>
      <h2>Genres Management</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Genre Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {genres.map((genre) => (
            <tr key={genre.id}>
              <td>{genre.id}</td>
              <td>{genre.name}</td>
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

export default CMSGenres;
