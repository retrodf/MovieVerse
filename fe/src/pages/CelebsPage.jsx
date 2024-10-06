import { Container } from "react-bootstrap";
import Celebs from "../components/CelebsComponent"; // Pastikan path komponen benar

const CelebsPage = () => {
  return (
    <Container className="" style={{ paddingTop: "100px" }}>
      <Celebs></Celebs>
    </Container>
  );
};

export default CelebsPage;
  