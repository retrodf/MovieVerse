import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { URL } from "../utils";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/MoviesPage.css";

const PopularMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      const url = URL + "/movies/popular";
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMovies(data);
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
    <div className="text-white popular-movies-container">
      <h3 className="popular-movies-title">POPULAR MOVIES</h3>
      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <Link to={`/movie/${movie.id}`}>
              <img
                src={movie.poster_url}
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
                    border: `5px solid ${movie.rating >= 4 ? "green" : "red"}`,
                    borderColor: `conic-gradient(green ${movie.rating * 10}%, #ccc 0)`,
                  }}
                >
                  <span className="rating-text">{movie.rating}</span>
                </div>
              </div>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  movie.title
                )}`}
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