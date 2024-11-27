import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { Container, Button } from "react-bootstrap";
import { URL } from "../utils"; // URL pointing to backend
import "../styles/Pagination.css";

const PopularMovies = () => {
  const [movies, setMovies] = useState([]); // Semua film
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const [moviesPerPage] = useState(10); // Jumlah film per halaman
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalPages = Math.ceil(movies.length / moviesPerPage); // Total jumlah halaman

  // Fetch all movies from backend
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${URL}/movies/popular`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMovies(data); // Simpan seluruh data film
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Hitung indeks film yang ditampilkan per halaman
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie); // Pilih film untuk halaman ini

  // Fungsi untuk pindah ke halaman berikutnya
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Fungsi untuk pindah ke halaman sebelumnya
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Fungsi untuk berpindah ke halaman yang dipilih
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Fungsi untuk menghasilkan array nomor halaman untuk ditampilkan
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Jumlah halaman yang terlihat sekaligus (misalnya 5)
    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  if (loading) return <p>Loading...</p>;
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
        {currentMovies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <Link to={`/movie/${movie.id}`}>
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="movie-poster"
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  transition: "transform 0.3s",
                }}
              />
            </Link>
            <div className="movie-info">
              <h5 style={styles.movieTitle}>{movie.title}</h5>
              <p>{movie.release_date}</p>
              <div className="rating-container">
                <div
                  className="rating-circle"
                  style={{
                    border: `5px solid ${movie.rating >= 7 ? "green" : "red"}`,
                    borderColor: `conic-gradient(green ${movie.rating * 10}%, #ccc 0)`,
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span>{movie.rating}</span>
                </div>
              </div>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon color="#dc3545" icon={faYoutube} size="2x" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <Button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="pagination-arrow"
        >
          &lt;
        </Button>

        {/* Menampilkan angka "1" secara manual hanya jika halaman lebih dari 2 */}
        {currentPage > 2 && (
          <>
            <Button onClick={() => paginate(1)} className="pagination-btn">
              1
            </Button>
            {currentPage > 3 && (
              <span className="pagination-ellipsis">...</span>
            )}
          </>
        )}

        {/* Perulangan untuk menampilkan nomor halaman */}
        {getPageNumbers().map((pageNumber) => (
          <Button
            key={pageNumber}
            onClick={() => paginate(pageNumber)}
            className={`pagination-btn ${pageNumber === currentPage ? "active" : ""}`}
          >
            {pageNumber}
          </Button>
        ))}

        {currentPage < totalPages - 2 && (
          <span className="pagination-ellipsis">...</span>
        )}
        {currentPage < totalPages - 1 && (
          <Button
            onClick={() => paginate(totalPages)}
            className="pagination-btn"
          >
            {totalPages}
          </Button>
        )}

        <Button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="pagination-arrow"
        >
          &gt;
        </Button>
      </div>
    </Container>
  );
};

// Styles for the component
const styles = {
  movieTitle: {
    textAlign: "center",
    whiteSpace: "normal",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
};

export default PopularMovies;
