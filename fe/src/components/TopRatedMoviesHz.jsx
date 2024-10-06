import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { Button, Container } from "react-bootstrap";
import { apiKey } from "../data";

const TopRatedMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // State untuk melacak halaman
  const [hasMore, setHasMore] = useState(true); // State untuk melacak apakah ada lagi data yang bisa di-load

  const fetchMovies = async (currentPage) => {
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=${currentPage}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMovies((prevMovies) => [...prevMovies, ...data.results]); // Append movies ke list
      setLoading(false);

      // Cek apakah ada halaman berikutnya
      if (data.page >= data.total_pages) {
        setHasMore(false); // Tidak ada lagi data untuk di-load
      }
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(page); // Panggil fetchMovies saat page berubah
  }, [page]);

  const loadMoreMovies = () => {
    setPage((prevPage) => prevPage + 1); // Tambahkan page saat load more diklik
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
        {movies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <Link to={`/movie/${movie.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
                style={{ width: '100%', borderRadius: '10px', transition: 'transform 0.3s' }}
              />
            </Link>
            <div className="movie-info">
              <h5 style={styles.movieTitle}>{movie.title}</h5> {/* Updated style for title */}
              <p>{movie.release_date}</p>
              <div className="rating-container">
                <div
                  className="rating-circle"
                  style={{
                    border: `5px solid ${movie.vote_average >= 7 ? "green" : "red"}`,
                    borderColor: `conic-gradient(green ${movie.vote_average * 10}%, #ccc 0)`,
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
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
            onClick={loadMoreMovies}
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
    textAlign: 'center', // Center the text
    whiteSpace: 'normal', // Allow the text to wrap
    overflow: 'hidden',   // Ensure no overflow
    textOverflow: 'ellipsis', // Optional: to add ellipsis if needed
    display: '-webkit-box',
    WebkitLineClamp: 2,   // Maximum number of lines (2 lines for example)
    WebkitBoxOrient: 'vertical',
  },
};

export default TopRatedMovies;
