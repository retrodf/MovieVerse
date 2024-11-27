import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/Homepage";
import CelebsPage from "../pages/CelebsPage";
import MoviesPage from "../pages/MoviesPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import SearchPage from "../pages/SearchPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage"; 
import AddMoviePage from "../pages/AddMovie";
// import Profile from "../pages/Profile";
import MovieDetail from "../components/MovieDetail";
import CelebsDetail from "../components/CelebsDetail";

function LandingRoutes({ setIsAuth }) {
  return (
    <Routes>
      {/* Tambahkan rute untuk Home */}
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/movie/:id" element={<MovieDetail />} />
      <Route path="/celeb/:id" element={<CelebsDetail />} />
      <Route path="/celebs" element={<CelebsPage />} />
      <Route path="/movies" element={<MoviesPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/login" element={<LoginPage setIsAuth={setIsAuth} />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
      <Route path="/resetPassword/:token" element={<ResetPasswordPage />} />
      <Route path="/movies/add" element={<AddMoviePage />} />
    </Routes>
  );
}

export default LandingRoutes;
