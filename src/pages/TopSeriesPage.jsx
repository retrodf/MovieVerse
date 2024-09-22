import { Container } from "react-bootstrap";
import TopRatedSeries from "../components/TopSeriesComponent";

const TopSeriesPage = () => {
  return (
    <Container className="" style={{ paddingTop: "100px" }}>
      <TopRatedSeries></TopRatedSeries>
    </Container>
  );
};

export default TopSeriesPage;
