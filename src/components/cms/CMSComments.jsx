import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';

const CMSComments = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Fetch comments data from API or database
    setComments([
      { id: 1, movie: "Inception", user: "John", comment: "Amazing movie!", date: "2024-02-20" },
      { id: 2, movie: "Avatar", user: "Jane", comment: "Great effects!", date: "2024-02-21" },
    ]);
  }, []);

  return (
    <Container>
      <h2>Comments Management</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Movie</th>
            <th>User</th>
            <th>Comment</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.id}>
              <td>{comment.id}</td>
              <td>{comment.movie}</td>
              <td>{comment.user}</td>
              <td>{comment.comment}</td>
              <td>{comment.date}</td>
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

export default CMSComments;
