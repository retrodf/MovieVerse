import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';

const CMSFilter = () => {
  const [filters, setFilters] = useState([]);
  const [newFilter, setNewFilter] = useState('');

  // Fetching data from API (contoh)
  useEffect(() => {
    // Panggil API untuk mendapatkan filter
    setFilters(['Action', 'Drama', 'Comedy']);  // Data dummy
  }, []);

  const handleAddFilter = () => {
    setFilters([...filters, newFilter]);
    setNewFilter('');
  };

  const handleDeleteFilter = (filter) => {
    setFilters(filters.filter(f => f !== filter));
  };

  return (
    <div className="cms-filter-page">
      <h2>Manage Filters</h2>
      <Form className="mb-3">
        <Form.Group>
          <Form.Label>Add New Filter</Form.Label>
          <Form.Control 
            type="text" 
            value={newFilter} 
            onChange={(e) => setNewFilter(e.target.value)} 
            placeholder="Enter filter name" 
          />
        </Form.Group>
        <Button onClick={handleAddFilter}>Add Filter</Button>
      </Form>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Filter Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filters.map((filter, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{filter}</td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteFilter(filter)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CMSFilter;
