import { Routes, Route, useLocation } from "react-router-dom";

import NavbarComponent from "./components/NavbarComponent";
import FooterComponent from "./components/FooterComponent";
import MovieDetail from "./components/MovieDetail";
import SeriesDetail from "./components/SeriesDetail";
import CelebsDetail from "./components/CelebsDetail";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchResult from "./pages/SearchResultPage";
import ForgotPassword from "./pages/ForgotPasswordPage";
import Profile from "./pages/Profile.jsx"

import HomePage from "./pages/Homepage";
import TestimonialPage from "./pages/TestimonialPage";
import CelebsPage from "./pages/CelebsPage";
import SyaratKetenPage from "./pages/SyaratKetenPage";
import MoviesPage from "./pages/MoviesPage";
import SeriesPage from "./pages/SeriesPage";
import AwardsPage from "./pages/AwardsPage";

// CMS Pages
import CMSAwards from "./components/cms/CMSAwards";
import CMSComments from "./components/cms/CMSComments";
import CMSGenres from "./components/cms/CMSGenres";
import CMSMovies from "./components/cms/CMSMovies";
import CMSSeries from "./components/cms/CMSSeries";
import CMSSeriesApproved from "./components/cms/CMSSeriesApproved";
import CMSSeriesInput from "./components/cms/CMSSeriesInput";


function App() {
  const location = useLocation();

  // Show header and footer except on specific routes
  const showHeader =
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    location.pathname !== "/forgotPassword";

  // Hide footer on login, register, forgotPassword, search, and searchResult pages
  const showFooter =
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    location.pathname !== "/forgotPassword"

  return (
    <div className="" style={{ backgroundColor: "black" }}>
      {showHeader && <NavbarComponent />}
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/series/:id" element={<SeriesDetail />} />
        <Route path="/celeb/:id" element={<CelebsDetail />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/series" element={<SeriesPage />} />
        <Route path="/testimonial" element={<TestimonialPage />} />
        <Route path="/celebs" element={<CelebsPage />} />
        <Route path="/awards" element={<AwardsPage />} />
        <Route path="/syaratketen" element={<SyaratKetenPage />} />
        <Route path="/searchResult" element={<SearchResult />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />

        {/* CMS Routes */}
        <Route path="/cms/awards" element={<CMSAwards />} />
        <Route path="/cms/comments" element={<CMSComments />} />
        <Route path="/cms/genres" element={<CMSGenres />} />
        <Route path="/cms/movies" element={<CMSMovies />} />
        <Route path="/cms/series" element={<CMSSeries />} />
        <Route path="/cms/series-approved" element={<CMSSeriesApproved />} />
        <Route path="/cms/series-input" element={<CMSSeriesInput />} />
      </Routes>
      {showFooter && <FooterComponent />}
    </div>
  );
}

export default App;
