import { Container } from "react-bootstrap";
import PopularMovies from "../components/PopularMovies";

const MoviesPage = () => {
  return (
    <Container className="" style={{ paddingTop: "100px" }}>
      <PopularMovies></PopularMovies>
    </Container>
  );
};

export default MoviesPage;
