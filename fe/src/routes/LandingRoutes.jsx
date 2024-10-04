import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/Homepage";
import MovieDetail from "../components/MovieDetail";
import SeriesDetail from "../components/SeriesDetail";
import CelebsDetail from "../components/CelebsDetail";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import SearchResultPage from "../pages/SearchResultPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import Profile from "../pages/Profile";
import MoviesPage from "../pages/MoviesPage";
import SeriesPage from "../pages/SeriesPage";
import AwardsPage from "../pages/AwardsPage";
import CelebsPage from "../pages/CelebsPage";

function LandingRoutes() {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/movie/:id" element={<MovieDetail />} />
      <Route path="/series/:id" element={<SeriesDetail />} />
      <Route path="/celebs/:id" element={<CelebsDetail />} />
      <Route path="/celebs" element={<CelebsPage />} />
      <Route path="/movies" element={<MoviesPage />} />
      <Route path="/series" element={<SeriesPage />} />
      <Route path="/awards" element={<AwardsPage />} />
      <Route path="/searchResult" element={<SearchResultPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default LandingRoutes;
