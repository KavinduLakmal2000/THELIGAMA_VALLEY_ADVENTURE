import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public site components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Activities from "./components/Activities";
import Schedule from "./components/Schedule";
import Reviews from "./components/Reviews";
import Guidelines from "./components/Guidelines";
import Booking from "./components/Booking";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

// Admin
import AdminApp from "./admin/AdminApp";
import AdminLogin from "./AdminLogin";
import ProtectedRoute from "./ProtectedRoute";

function PublicSite() {
  return (
    <div className="bg-stone-950 min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Activities />
      <Schedule />
      <Reviews />
      <Guidelines />
      <Booking />
      <Contact />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public site */}
        <Route path="/" element={<PublicSite />} />

        {/* Hidden admin login — no link from public site */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected admin panel */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminApp />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
