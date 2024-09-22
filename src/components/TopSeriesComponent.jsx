import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import "../styles/Navbar.css";
import { apiKey } from "../data";

const TopRatedSeries = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeries = async () => {
      const url = `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSeries(data.results);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchSeries();
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
        TOP RATED SERIES
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
        {series.map((tvShow) => (
          <div key={tvShow.id} className="movie-item">
            <Link to={`/series/${tvShow.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                alt={tvShow.name}
                className="movie-poster"
              />
            </Link>
            <div className="movie-info">
              <h5>{tvShow.name}</h5>
              <p>{tvShow.first_air_date}</p>
              <div className="rating-container">
                <div
                  className="rating-circle"
                  style={{
                    border: `5px solid ${tvShow.vote_average >= 7 ? "green" : "red"}`,
                    borderColor: `conic-gradient(green ${tvShow.vote_average * 10}%, #ccc 0)`,
                  }}
                >
                  <span className="rating-text">{tvShow.vote_average}</span>
                </div>
              </div>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(tvShow.name)}`}
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

export default TopRatedSeries;
