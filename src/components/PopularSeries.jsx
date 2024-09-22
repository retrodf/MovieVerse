import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";  // Pastikan ini digunakan untuk navigasi ke halaman detail
import { apiKey } from "../data";

const PopularSeries = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeries = async () => {
      const url = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data); // Debugging: untuk memverifikasi data yang diterima dari API
        setSeries(data.results);
        setLoading(false);
      } catch (error) {
        console.error(error); // Log error di konsol untuk debugging
        setError(error);
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  // Tampilkan pesan loading saat data masih diambil
  if (loading) return <p>Loading...</p>;

  // Tampilkan pesan error jika terjadi kesalahan saat pengambilan data
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
        POPULAR SERIES
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
        {series.map((serie) => (
          <div key={serie.id} className="movie-item">
            {/* Link ke halaman detail series berdasarkan ID */}
            <Link to={`/series/${serie.id}`}>
              <img
                src={
                  serie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${serie.poster_path}` // Jika poster tersedia
                    : "https://via.placeholder.com/500x750?text=No+Image" // Placeholder jika tidak ada poster
                }
                alt={serie.name}
                className="movie-poster"
              />
            </Link>
            <div className="movie-info">
              <h5>{serie.name}</h5>
              <p>{serie.first_air_date}</p>
              <div className="rating-container">
                <div
                  className="rating-circle"
                  style={{
                    border: `5px solid ${serie.vote_average >= 7 ? "green" : "red"}`, // Hijau jika rating tinggi, merah jika rendah
                    borderColor: `conic-gradient(green ${serie.vote_average * 10}%, #ccc 0)`,
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
                <FontAwesomeIcon icon={faYoutube} color="#dc3545" size="2x" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularSeries;
