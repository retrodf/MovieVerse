import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';

const CMSMoviesApproved = () => {
  const [movies, setMovies] = useState([
    { id: 1, title: 'Avengers: Endgame' },
    { id: 2, title: 'The Lion King' }
  ]);

  const handleDeleteMovie = (id) => {
    setMovies(movies.filter(movie => movie.id !== id));
  };

  return (
    <div className="cms-movies-approved-page">
      <h2>Approved Movies</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie, index) => (
            <tr key={movie.id}>
              <td>{index + 1}</td>
              <td>{movie.title}</td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteMovie(movie.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CMSMoviesApproved;
