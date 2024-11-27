import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../styles/Celebs.css";
import { URL } from "../utils";
import "../styles/Pagination.css"; // Import styles for pagination

const CelebsComponent = () => {
  const [celebs, setCelebs] = useState([]); // Semua selebriti
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const [celebsPerPage] = useState(12); // Jumlah selebriti per halaman
  const [totalPages, setTotalPages] = useState(0); // Total jumlah halaman

  // Fetch celebs data with pagination
  useEffect(() => {
    const fetchCelebs = async () => {
      setLoading(true); // Set loading to true at the start of the fetch
      const url = `${URL}/actors?page=${currentPage}&limit=${celebsPerPage}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch celebrities.");
        }

        const data = await response.json();
        setCelebs(data.actors); // Menyimpan data selebriti untuk halaman saat ini
        setTotalPages(data.meta.totalPages); // Mengatur jumlah halaman dari respons
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchCelebs();
  }, [currentPage, celebsPerPage]);

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

  if (loading) return <p>Loading...</p>; // Tampilkan loading saat data sedang dimuat
  if (error) return <p>Error: {error.message}</p>; // Tampilkan error jika ada

  return (
    <Container>
      <Row>
        {celebs.map((celeb) => (
          <Col key={celeb.id} md={3} className="mb-4 celeb-item">
            <Link to={`/celeb/${celeb.id}`} className="celeb-link">
              <div className="celeb-image-wrapper">
                <img
                  src={celeb.image} // Mengambil image selebriti dari API
                  alt={celeb.name}
                  className="img-fluid rounded"
                />
                <div className="celeb-name">{celeb.name}</div>
              </div>
            </Link>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <div className="pagination-container text-center">
        <Button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="pagination-arrow"
        >
          &lt;
        </Button>

        {currentPage > 2 && (
          <>
            <Button onClick={() => paginate(1)} className="pagination-btn">1</Button>
            {currentPage > 3 && <span className="pagination-ellipsis">...</span>}
          </>
        )}

        {getPageNumbers().map((pageNumber) => (
          <Button
            key={pageNumber}
            onClick={() => paginate(pageNumber)}
            className={`pagination-btn ${pageNumber === currentPage ? "active" : ""}`}
          >
            {pageNumber}
          </Button>
        ))}

        {currentPage < totalPages - 2 && <span className="pagination-ellipsis">...</span>}
        {currentPage < totalPages - 1 && (
          <Button onClick={() => paginate(totalPages)} className="pagination-btn">
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

export default CelebsComponent;