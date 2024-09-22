import React, { useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';

const CMSActors = () => {
  const [actors, setActors] = useState([
    { id: 1, name: 'Robert Downey Jr.' },
    { id: 2, name: 'Scarlett Johansson' }
  ]);
  const [newActor, setNewActor] = useState('');

  const handleAddActor = () => {
    setActors([...actors, { id: actors.length + 1, name: newActor }]);
    setNewActor('');
  };

  const handleDeleteActor = (id) => {
    setActors(actors.filter(actor => actor.id !== id));
  };

  return (
    <div className="cms-actors-page">
      <h2>Manage Actors</h2>
      <Form className="mb-3">
        <Form.Group>
          <Form.Label>Add New Actor</Form.Label>
          <Form.Control 
            type="text" 
            value={newActor} 
            onChange={(e) => setNewActor(e.target.value)} 
            placeholder="Enter actor name" 
          />
        </Form.Group>
        <Button onClick={handleAddActor}>Add Actor</Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Actor Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {actors.map((actor, index) => (
            <tr key={actor.id}>
              <td>{index + 1}</td>
              <td>{actor.name}</td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteActor(actor.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CMSActors;
