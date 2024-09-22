import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { apiKey } from "../data";
import "../styles/AwardsPage.css";

const AwardPage = () => {
  const [awardMovies, setAwardMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAwardMovies = async () => {
      const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAwardMovies(data.results);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchAwardMovies();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const awardCategories = [
    "Best Picture",
    "Best Director",
    "Best Actor",
    "Best Actress",
  ];

  return (
    <div className="award-page-container text-white">
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
        AWARD-WINNING MOVIES
      </h3>
      {awardCategories.map((category, index) => (
        <div key={index} className="category-section">
          <h4
            style={{
              fontFamily: "Roboto, Helvetica, Arial, sans-serif",
              fontWeight: "bold",
              borderBottom: "3px solid #6c757d",
              display: "inline-block",
              paddingBottom: "10px",
              marginBottom: "20px",
            }}
          >
            {category}
          </h4>
          <div className="movie-list">
            {awardMovies.slice(index * 3, index * 3 + 3).map((movie) => (
              <div key={movie.id} className="movie-item">
                <Link to={`/movie/${movie.id}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
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
                        border: `5px solid ${movie.vote_average >= 7 ? "green" : "red"}`,
                        borderColor: `conic-gradient(green ${movie.vote_average * 10}%, #ccc 0)`,
                      }}
                    >
                      <span className="rating-text">{movie.vote_average}</span>
                    </div>
                  </div>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="movie-info-icon"
                  >
                    <FontAwesomeIcon
                      color="#dc3545"
                      icon={faYoutube}
                      size="2x"
                    />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AwardPage;
