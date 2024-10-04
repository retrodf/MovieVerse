import React, { useState, useEffect } from "react";
import { Container, Row, Col, Carousel, Form, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const MovieDetailPage = () => {
  const { id } = useParams(); // Get the movie ID from the URL parameters
  const [backdrops, setBackdrops] = useState([]); 
  const [trailers, setTrailers] = useState([]);
  const [actors, setActors] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]); // Asumsikan ini bagian dari backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(3); // Default number of reviews to display

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const movieResponse = await axios.get(`http://localhost:5000/api/admin/movie/${id}`);
        const trailersResponse = await axios.get(`http://localhost:5000/api/admin/movie/${id}/trailers`);
        const actorsResponse = await axios.get(`http://localhost:5000/api/admin/movie/${id}/actors`);
        const reviewsResponse = await axios.get(`http://localhost:5000/api/admin/movie/${id}/reviews`);

        setMovie(movieResponse.data);
        setTrailers(trailersResponse.data.trailers); // Assuming trailers is an array in response
        setActors(actorsResponse.data);
        setReviews(reviewsResponse.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  const loadMoreReviews = () => {
    setVisibleReviews(visibleReviews + 3); // Load more reviews on button click
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    // Logic to add a new review
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {/* Detail rendering, trailers, actors, reviews, etc */}
      {/* Code from the original MovieDetailPage component remains mostly unchanged */}
    </div>
  );
};

export default MovieDetailPage;
