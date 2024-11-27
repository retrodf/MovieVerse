import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavbarComponent from "./components/NavbarComponent";
import FooterComponent from "./components/FooterComponent";
import LandingPageRoutes from "./routes/LandingRoutes";
import CMSRoutes from "./routes/CMSRoutes";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);

  // Cek apakah token JWT ada di localStorage saat pertama kali aplikasi dijalankan
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuth(true); // Jika token ada, pengguna dianggap sudah login
    } else {
      setIsAuth(false); // Jika tidak ada token, pengguna belum login
    }
  }, [location]);

  const showHeader =
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    location.pathname !== "/forgotPassword" &&
    !location.pathname.includes("/resetPassword") && // Tambahkan pengecualian reset password
    !location.pathname.includes("/cms");

  const showFooter =
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    location.pathname !== "/forgotPassword" &&
    !location.pathname.includes("/resetPassword") && // Tambahkan pengecualian reset password
    !location.pathname.includes("/cms");

  return (
    <div style={{ backgroundColor: "black" }}>
      {/* Tampilkan Navbar jika bukan di halaman login/register */}
      {showHeader && <NavbarComponent isAuth={isAuth} setIsAuth={setIsAuth} />}
      
      {/* Routing untuk CMS atau Landing Page */}
      {location.pathname.includes("/cms") ? (
        <CMSRoutes />
      ) : (
        <LandingPageRoutes setIsAuth={setIsAuth} />
      )}

      {/* Tampilkan Footer jika bukan di halaman login/register */}
      {showFooter && <FooterComponent />}
    </div>
  );
}

export default App;
