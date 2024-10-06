import { useState } from "react";
import { Container } from "react-bootstrap";
import PopularMovies from "../components/PopMoviesHz"; // Pastikan ini adalah komponen PopularMovies
import TopRatedMovies from "../components/TopRatedMoviesHz"; // Pastikan ini adalah komponen TopRatedMovies

const MoviesPage = () => {
  const [activeTab, setActiveTab] = useState("popular"); // Tab default adalah popular

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Container className="" style={{ paddingTop: "100px" }}>
      {/* Tabs */}
      <div className="movies-tabs" style={styles.tabsContainer}>
        <button
          className={`tab ${activeTab === "popular" ? "active" : ""}`}
          style={{ ...styles.tabButton, ...(activeTab === "popular" ? styles.activeTabButton : {}) }}
          onClick={() => handleTabClick("popular")}
        >
          Popular
        </button>
        <button
          className={`tab ${activeTab === "top_rated" ? "active" : ""}`}
          style={{ ...styles.tabButton, ...(activeTab === "top_rated" ? styles.activeTabButton : {}) }}
          onClick={() => handleTabClick("top_rated")}
        >
          Top Rated
        </button>
      </div>

      {/* Conditional Rendering based on the active tab */}
      <div className="movies-content">
        {activeTab === "popular" && <PopularMovies />}
        {activeTab === "top_rated" && <TopRatedMovies />}
      </div>
    </Container>
  );
};

// Styles for the component
const styles = {
  tabsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  tabButton: {
    backgroundColor: '#333',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1em',
    margin: '0 10px',
    transition: 'background-color 0.3s ease',
  },
  activeTabButton: {
    backgroundColor: '#dc3545',
  },
};

export default MoviesPage;
