import { useLocation } from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import FooterComponent from "./components/FooterComponent";
import LandingPageRoutes from "./routes/LandingRoutes";
import CMSRoutes from "./routes/CMSRoutes";

function App() {
  const location = useLocation();

  // Menentukan kapan header dan footer ditampilkan
  const showHeader =
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    location.pathname !== "/forgotPassword" &&
    !location.pathname.includes("/cms");

  const showFooter =
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    location.pathname !== "/forgotPassword" &&
    !location.pathname.includes("/cms");

  return (
    <div style={{ backgroundColor: "black" }}>
      {showHeader && <NavbarComponent />}
      {location.pathname.includes("/cms") ? (
        <CMSRoutes />
      ) : (
        <LandingPageRoutes />
      )}
      {showFooter && <FooterComponent />}
    </div>
  );
}

export default App;
