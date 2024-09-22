import { Container } from "react-bootstrap";
import TopRatedMovies from "../components/TopMoviesComponent";

const TopMoviesPage = () => {
  return (
    <Container className="" style={{ paddingTop: "100px" }}>
      <TopRatedMovies></TopRatedMovies>
    </Container>
  );
};

export default TopMoviesPage;
