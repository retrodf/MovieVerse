import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; 
import { Container, Row, Col, Carousel } from "react-bootstrap";
import { apiKey } from "../data"; 
import "../styles/CelebsDetail.css";

const CelebsDetailComponent = () => {
  const { id } = useParams();
  const [celeb, setCeleb] = useState(null);
  const [movies, setMovies] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCelebDetail = async () => {
      const celebUrl = `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}`;
      const moviesUrl = `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${apiKey}`;
      const imagesUrl = `https://api.themoviedb.org/3/person/${id}/images?api_key=${apiKey}`;

      try {
        const [celebResponse, moviesResponse, imagesResponse] = await Promise.all([
          fetch(celebUrl),
          fetch(moviesUrl),
          fetch(imagesUrl),
        ]);

        if (!celebResponse.ok || !moviesResponse.ok || !imagesResponse.ok) {
          throw new Error("Failed to fetch celebrity data.");
        }

        const celebData = await celebResponse.json();
        const moviesData = await moviesResponse.json();
        const imagesData = await imagesResponse.json();

        setCeleb(celebData);
        setMovies(moviesData.cast); // Display all movies
        setImages(imagesData.profiles); // Display all images
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchCelebDetail();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container className="celeb-detail-container">
      {celeb && (
        <>
          {/* Bagian atas dengan nama selebriti dan profesi */}
          <div className="celeb-header text-center text-white">
            <h1>{celeb.name}</h1>
            <p className="text-danger">{celeb.known_for_department}</p>
          </div>

          <Row className="mt-5">
            {/* Foto selebriti */}
            <Col md={4}>
              <img
                src={`https://image.tmdb.org/t/p/w500${celeb.profile_path}`}
                alt={celeb.name}
                className="img-fluid rounded celeb-photo"
              />
            </Col>

            {/* Detail pribadi selebriti */}
            <Col md={8} className="text-white celeb-details">
              <h3>Mini Bio</h3>
              <p className="bio-text">{celeb.biography}</p>

              <div className="overview mt-5">
                <h3>Overview</h3>
                <p><strong>Born:</strong> {celeb.birthday} - {celeb.place_of_birth}</p>
                <p><strong>Height:</strong> {celeb.height ? `${celeb.height}` : "Unknown"}</p>
              </div>
            </Col>
          </Row>

          {/* Bagian filmografi selebriti */}
          <div className="movies-section mt-5">
            <h3 className="text-white">Movies</h3>
            <Carousel fade>
              {movies.map((movie, index) => (
                <Carousel.Item key={index}>
                  <Row>
                    {movies.slice(index * 5, index * 5 + 5).map((movie) => (
                      <Col md={2} key={movie.id} className="movie-card">
                        <Link to={`/movie/${movie.id}`}>
                          <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="img-fluid rounded"
                          />
                          <p className="mt-2 text-white">{movie.title}</p>
                        </Link>
                      </Col>
                    ))}
                  </Row>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>

          {/* Bagian foto selebriti */}
          <div className="photos-section mt-5">
            <h3 className="text-white">Photos</h3>
            <Carousel fade>
              {images.map((image, index) => (
                <Carousel.Item key={index}>
                  <Row>
                    {images.slice(index * 5, index * 5 + 5).map((image, index) => (
                      <Col md={2} key={index} className="photo-card">
                        <img
                          src={`https://image.tmdb.org/t/p/w200${image.file_path}`}
                          alt={`${celeb.name} photo`}
                          className="img-fluid rounded mb-2"
                        />
                      </Col>
                    ))}
                  </Row>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </>
      )}
    </Container>
  );
};

export default CelebsDetailComponent;