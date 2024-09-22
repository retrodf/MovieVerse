import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';

const CMSMovies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch movies data from API or database
    setMovies([
      { id: 1, title: "Inception", genre: "Sci-Fi", releaseDate: "2010-07-16" },
      { id: 2, title: "Avatar", genre: "Fantasy", releaseDate: "2009-12-18" },
    ]);
  }, []);

  return (
    <Container>
      <h2>Movies Management</h2>
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
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.id}</td>
              <td>{movie.title}</td>
              <td>{movie.genre}</td>
              <td>{movie.releaseDate}</td>
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

export default CMSMovies;