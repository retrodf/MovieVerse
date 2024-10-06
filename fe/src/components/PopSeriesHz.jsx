import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import { Button, Container } from "react-bootstrap"; // Pastikan kamu menggunakan React Bootstrap
import { apiKey } from "../data";

const PopularSeries = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Melacak halaman yang sedang di-load
  const [hasMore, setHasMore] = useState(true); // Melacak apakah ada lagi data yang bisa di-load

  const fetchSeries = async (currentPage) => {
    const url = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&page=${currentPage}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSeries((prevSeries) => [...prevSeries, ...data.results]); // Append series ke list
      setLoading(false);
      
      if (data.page >= data.total_pages) {
        setHasMore(false); // Jika tidak ada lagi data untuk di-load
      }
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries(page); // Panggil fetchSeries saat page berubah
  }, [page]);

  const loadMoreSeries = () => {
    setPage((prevPage) => prevPage + 1); // Tambahkan halaman saat load more diklik
  };

  if (loading && page === 1) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container className="text-white">
      <div
        className="movie-list"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
          padding: "10px 0",
        }}
      >
        {series.map((serie) => (
          <div key={serie.id} className="movie-item">
            <Link to={`/series/${serie.id}`}>
              <img
                src={
                  serie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${serie.poster_path}`
                    : "https://via.placeholder.com/500x750?text=No+Image"
                }
                alt={serie.name}
                className="movie-poster"
                style={{ width: '100%', borderRadius: '10px', transition: 'transform 0.3s' }}
              />
            </Link>
            <div className="movie-info">
              <h5 style={styles.movieTitle}>{serie.name}</h5>
              <p>{serie.first_air_date}</p>
              <div className="rating-container">
                <div
                  className="rating-circle"
                  style={{
                    border: `5px solid ${serie.vote_average >= 7 ? "green" : "red"}`,
                    borderColor: `conic-gradient(green ${serie.vote_average * 10}%, #ccc 0)`,
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span className="rating-text">{serie.vote_average}</span>
                </div>
              </div>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(serie.name)}`}
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

      {/* Tombol Load More */}
      {hasMore && (
        <div className="text-center">
          <Button
            onClick={loadMoreSeries}
            className="mt-4"
            style={{ backgroundColor: "red", border: "none" }}
          >
            Load More
          </Button>
        </div>
      )}
    </Container>
  );
};

// Styles for the component
const styles = {
  movieTitle: {
    textAlign: 'center',
    whiteSpace: 'normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
};

export default PopularSeries;
