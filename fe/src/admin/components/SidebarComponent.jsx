import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SidebarComponent = () => {
  return (
    <Nav className="flex-column">
      <Link to="/cms/filter" className="nav-link">CMS Filter</Link>
      <Link to="/cms/awards" className="nav-link">CMS Awards</Link>
      <Link to="/cms/genres" className="nav-link">CMS Genres</Link>
      <Link to="/cms/actors" className="nav-link">CMS Actors</Link>
      <Link to="/cms/comments" className="nav-link">CMS Comments</Link>
      <Link to="/cms/movies" className="nav-link">CMS Movies</Link>
      <Link to="/cms/movies-input" className="nav-link">CMS Movies Input</Link>
      <Link to="/cms/series" className="nav-link">CMS Series</Link>
      <Link to="/cms/series-input" className="nav-link">CMS Series Input</Link>
    </Nav>
  );
};

export default SidebarComponent;
