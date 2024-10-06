import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { apiKey } from "../data";
import "../styles/Celebs.css";

const CelebsComponent = () => {
  const [celebs, setCelebs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // State untuk nomor halaman
  const [hasMore, setHasMore] = useState(true); // State untuk memeriksa apakah ada data lagi yang bisa dimuat

  useEffect(() => {
    const fetchCelebs = async () => {
      const url = `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&page=${page}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch celebrities.");
        }
        const data = await response.json();
        setCelebs((prevCelebs) => [...prevCelebs, ...data.results]); // Tambahkan selebriti baru
        setHasMore(data.page < data.total_pages); // Cek apakah masih ada halaman berikutnya
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchCelebs();
  }, [page]); // Jalankan efek ini setiap kali halaman berubah

  // Fungsi untuk memuat lebih banyak selebriti
  const loadMoreCelebs = () => {
    setPage((prevPage) => prevPage + 1); // Tambahkan nomor halaman
  };

  if (loading && page === 1) return <p>Loading...</p>; // Loading saat pertama kali memuat halaman
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container>
      <Row>
        {celebs.map((celeb) => (
          <Col key={celeb.id} md={3} className="mb-4 celeb-item">
            <Link to={`/celeb/${celeb.id}`} className="celeb-link">
              <div className="celeb-image-wrapper">
                <img
                  src={`https://image.tmdb.org/t/p/w500${celeb.profile_path}`}
                  alt={celeb.name}
                  className="img-fluid rounded"
                />
                <div className="celeb-name">{celeb.name}</div>
              </div>
            </Link>
          </Col>
        ))}
      </Row>

      {/* Tombol Load More */}
      {hasMore && (
        <div className="text-center">
          <Button
            onClick={loadMoreCelebs}
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

export default CelebsComponent;
