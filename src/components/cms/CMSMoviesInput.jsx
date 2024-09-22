import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const CMSMoviesInput = () => {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lakukan aksi untuk submit form
    console.log({ title, genre, description });
  };

  return (
    <div className="cms-movies-input-page">
      <h2>Input New Movie</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Movie Title</Form.Label>
          <Form.Control 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter movie title" 
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Genre</Form.Label>
          <Form.Control 
            type="text" 
            value={genre} 
            onChange={(e) => setGenre(e.target.value)} 
            placeholder="Enter movie genre" 
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={3} 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Enter movie description" 
          />
        </Form.Group>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
};

export default CMSMoviesInput;
