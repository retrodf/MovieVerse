// import { useState, useEffect } from "react";
// import { Container, Row, Col, Carousel } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import PopularMovies from "../components/PopularMovies";
// import PopularSeries from "../components/PopularSeries";
// import { apiKey } from "../data";
// import TopRatedMovies from "../components/TopMoviesComponent";
// import TopRatedSeries from "../components/TopSeriesComponent";

// const HomePage = () => {
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   let navigate = useNavigate();

//   useEffect(() => {
//     const fetchImages = async () => {
//       const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;
//       try {
//         const response = await fetch(url);
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const data = await response.json();
//         setImages(data.results.slice(0, 5)); // Ambil hanya 5 gambar
//         setLoading(false);
//       } catch (error) {
//         setError(error);
//         setLoading(false);
//       }
//     };

//     fetchImages();
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <div>
//       <header
//         className="w-100 min-vh-100 d-flex align-items-center"
//         style={{
//           position: "relative",
//           overflow: "hidden", // Prevent overflow
//         }}
//       >
//         <Carousel fade>
//           {images.map((image) => (
//             <Carousel.Item key={image.id}>
//               <div
//                 style={{
//                   backgroundImage: `url('https://image.tmdb.org/t/p/original${image.backdrop_path}')`,
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                   height: "100vh",
//                   width: "100vw", // Ensure full width
//                 }}
//               >
//                 <div
//                   className="d-flex align-items-center justify-content-center w-100 h-100"
//                   style={{
//                     background:
//                       "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)",
//                   }}
//                 >
//                   <Container>
//                     <Row className="header-box d-flex align-items-center pt-lg-5">
//                       <Col lg="6">
//                         <h1 className="mb-4 fw-bold">
//                           {image.title || image.name} <br />
//                         </h1>
//                         <Row className="mb-3">
//                           <Col>
//                             <button
//                               style={{ borderRadius: "50px" }}
//                               className="btn btn-danger me-2"
//                             >
//                               Animation
//                             </button>
//                             <button
//                               style={{ borderRadius: "50px" }}
//                               className="btn btn-danger"
//                             >
//                               Comedy
//                             </button>
//                           </Col>
//                           <Col className="d-flex align-items-center">
//                             <span className="text-warning fw-bold ms-3">
//                               <i className="fa-solid fa-star"></i> 4.5/5
//                             </span>
//                           </Col>
//                         </Row>
//                         <p className="mb-4">
//                           Lorem ipsum dolor sit amet consectetur adipisicing
//                           elit. Voluptatem nihil voluptates possimus debitis,
//                           veniam ex?
//                         </p>
//                         <button
//                           className="btn btn-danger btn-lg rounded-1 me-2"
//                           onClick={() => navigate("/kelas")}
//                         >
//                           Watch Now
//                         </button>
//                       </Col>
//                     </Row>
//                   </Container>
//                 </div>
//               </div>
//             </Carousel.Item>
//           ))}
//         </Carousel>
//       </header>
//       {/* <Container className="mt-3">
//         <div id="#movies">
//           <PopularMovies />
//         </div>
//         <div>
//           <PopularSeries />
//         </div>
//         <div>
//           <TopRatedMovies />
//         </div>
//         <div>
//           <TopRatedSeries />
//         </div>
//       </Container> */}
//       <Container className="mt-3">
//         <div id="#movies" style={{ marginBottom: "50px" }}>
//           <PopularMovies />
//         </div>
//         <div style={{ marginBottom: "50px" }}>
//           <PopularSeries />
//         </div>
//         <div style={{ marginBottom: "50px" }}>
//           <TopRatedMovies />
//         </div>
//         <div style={{ marginBottom: "50px" }}>
//           <TopRatedSeries />
//         </div>
//       </Container>
//     </div>
//   );
// };

// export default HomePage;

import { useState, useEffect } from "react";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PopularMovies from "../components/PopularMovies";
import PopularSeries from "../components/PopularSeries";
import { apiKey } from "../data";
import TopRatedMovies from "../components/TopMoviesComponent";
import TopRatedSeries from "../components/TopSeriesComponent";
import DropdownFilterCustom from "../components/Filter";
import "../styles/HomePage.css";

const HomePage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movies] = useState([]);
  const [series] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filteredSeries] = useState([]);

  const navigate = useNavigate();

  const [filters] = useState({
    years: ["2020", "2021", "2022"],
    genres: ["Comedy", "Action", "Drama"],
    availability: ["Available", "Not Available"],
    countries: ["USA", "UK", "France"],
    sortOptions: ["Rating", "Popularity"],
  });

  const [selectedFilters, setSelectedFilters] = useState({
    year: "",
    genre: "",
    availability: "",
    country: "",
    sortBy: "",
  });

  useEffect(() => {
    const fetchImages = async () => {
      const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setImages(data.results.slice(0, 5));
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    const filterMovies = () => {
      let filtered = movies;
      if (selectedFilters.year) {
        filtered = filtered.filter(
          (movie) =>
            movie.release_date &&
            movie.release_date.startsWith(selectedFilters.year)
        );
      }
      if (selectedFilters.genre) {
        filtered = filtered.filter(
          (movie) =>
            movie.genre_ids && movie.genre_ids.includes(selectedFilters.genre)
        );
      }
      if (selectedFilters.country) {
        filtered = filtered.filter((movie) =>
          movie.production_countries.some(
            (c) => c.name === selectedFilters.country
          )
        );
      }

      if (selectedFilters.sortBy === "Rating") {
        filtered = filtered.sort((a, b) => b.vote_average - a.vote_average);
      } else if (selectedFilters.sortBy === "Popularity") {
        filtered = filtered.sort((a, b) => b.popularity - a.popularity);
      }

      setFilteredMovies(filtered);
    };

    filterMovies();
  }, [movies, selectedFilters]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="home">
      <header
        className="w-100 min-vh-100 d-flex align-items-center"
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Carousel fade>
          {images.map((image) => (
            <Carousel.Item key={image.id}>
              <div
                style={{
                  backgroundImage: `url('https://image.tmdb.org/t/p/original${image.backdrop_path}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "100vh",
                  width: "100vw",
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center w-100 h-100"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)",
                  }}
                >
                  <Container>
                    <Row className="header-box d-flex align-items-center pt-lg-5">
                      <Col lg="6">
                        <h1 className="mb-4 fw-bold">
                          {image.title || image.name} <br />
                        </h1>
                        <p className="mb-4">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Voluptatem nihil voluptates possimus debitis,
                          veniam ex?
                        </p>
                        <button
                          className="btn btn-danger btn-lg rounded-2 me-2"
                          onClick={() => navigate("/kelas")}
                        >
                          Watch Now
                        </button>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </header>

      {/* Filter Bar */}
      <Container className="dropdown-container">
        <div className="label-filter">Filter by:</div>
        <DropdownFilterCustom
          label="Year"
          options={filters.years}
          onSelect={(option) =>
            setSelectedFilters((prev) => ({ ...prev, year: option }))
          }
          className="dropdown-filter"
        />
        <DropdownFilterCustom
          label="Genre"
          options={filters.genres}
          onSelect={(option) =>
            setSelectedFilters((prev) => ({ ...prev, genre: option }))
          }
          className="dropdown-filter"
        />
                <DropdownFilterCustom
          label="Country"
          options={filters.countries}
          onSelect={(option) =>
            setSelectedFilters((prev) => ({ ...prev, country: option }))
          }
          className="dropdown-filter"
        />
        <DropdownFilterCustom
          label="Availability"
          options={filters.availability}
          onSelect={(option) =>
            setSelectedFilters((prev) => ({ ...prev, availability: option }))
          }
          className="dropdown-filter"
        />
        <DropdownFilterCustom
          label="Sort By"
          options={filters.sortOptions}
          onSelect={(option) =>
            setSelectedFilters((prev) => ({ ...prev, sortBy: option }))
          }
          className="dropdown-filter"
        />
      </Container>

      {/* Movies & Series Section */}
      <Container className="mt-1">
        <div id="#movies" style={{ marginBottom: "50px" }}>
          <PopularMovies
            movies={filteredMovies.length > 0 ? filteredMovies : movies}
          />
        </div>
        <div style={{ marginBottom: "50px" }}>
          <PopularSeries
            series={filteredSeries.length > 0 ? filteredSeries : series}
          />
        </div>
        <div style={{ marginBottom: "50px" }}>
          <TopRatedMovies />
        </div>
        <div style={{ marginBottom: "50px" }}>
          <TopRatedSeries />
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
