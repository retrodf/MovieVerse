import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";

const PopularMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/movie/popular"); // Panggil API dari backend
        setMovies(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="text-white">
      <h3
        style={{
          fontFamily: "Roboto, Helvetica, Arial, sans-serif",
          fontWeight: "bold",
          borderBottom: "5px solid #dc3545",
          display: "inline-block",
          paddingBottom: "10px",
          marginBottom: "20px",
        }}
      >
        POPULAR MOVIES
      </h3>
      <div
        className="movie-list"
        style={{
          display: "flex",
          overflowX: "scroll",
          padding: "10px 0",
          gap: "10px",
          whiteSpace: "nowrap",
        }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <Link to={`/movie/${movie.id}`}>
              <img
                src={movie.poster_url} // Menggunakan poster_url dari backend
                alt={movie.title}
                className="movie-poster"
              />
            </Link>
            <div className="movie-info">
              <h5>{movie.title}</h5>
              <p>{movie.release_date}</p>
              <div className="rating-container">
                <div
                  className="rating-circle"
                  style={{
                    border: `5px solid ${movie.rating >= 7 ? "green" : "red"}`,
                    borderColor: `conic-gradient(green ${movie.rating * 10}%, #ccc 0)`,
                  }}
                >
                  <span className="rating-text">{movie.rating}</span>
                </div>
              </div>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="movie-info-icon"
              >
                <FontAwesomeIcon color="#dc3545" icon={faYoutube} size="2x" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularMovies;
