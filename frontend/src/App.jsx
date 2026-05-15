import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar          from "./components/Navbar";
import Hero            from "./components/Hero";
import About           from "./components/About";
import Activities      from "./components/Activities";
import Schedule        from "./components/Schedule";
import Reviews         from "./components/Reviews";
import Guidelines      from "./components/Guidelines";
import Booking         from "./components/Booking";
import Contact         from "./components/Contact";
import Footer          from "./components/Footer";
import ParallaxDivider from "./components/ParallaxDivider";

import AdminApp       from "./admin/AdminApp";
import AdminLogin     from "./AdminLogin";
import ProtectedRoute from "./ProtectedRoute";

// ─── Parallax image config ────────────────────────────────────────────────────
// Using Unsplash source URLs — swap for your own photos any time
const PARALLAX = {
  // Between About → Activities : aerial river shot
  river: {
    image:      "https://lakpura.com/cdn/shop/files/LK94009714-08-E.webp?v=1765351503&width=3200",
    quote:      "WHERE THE RIVER TAKES CONTROL",
    quoteSmall: "Kelani River · Kithulgala, Sri Lanka",
    speed:      0.35,
    overlay:    0.50,
    height:     "480px",
  },
  // Between Schedule → Reviews : jungle canopy / rainforest
  jungle: {
    image:      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1800&q=85",
    quote:      "SURROUNDED BY NATURE, GUIDED BY EXPERTS",
    quoteSmall: "Kithulgala Rainforest · Est. adventures since 2010",
    speed:      0.30,
    overlay:    0.45,
    height:     "440px",
    position:   "center 30%",
  },
  // Between Reviews → Guidelines : rafting action shot
  raft: {
    image:      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1800&q=85",
    quote:      "EVERY RAPID, A NEW STORY",
    quoteSmall: "White Water Rafting · Grade III – IV Rapids",
    speed:      0.40,
    overlay:    0.48,
    height:     "460px",
  },
  // Between Guidelines → Booking : waterfall / calm water
  waterfall: {
    image:      "https://images.unsplash.com/photo-1478827387698-1527781a4887?w=1800&q=85",
    quote:      "YOUR ADVENTURE STARTS WITH ONE BOOKING",
    quoteSmall: "Safe · Guided · Unforgettable",
    speed:      0.35,
    overlay:    0.42,
    height:     "440px",
    position:   "center 60%",
  },
};

// ─── Body theme switcher ──────────────────────────────────────────────────────
function BodyTheme() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      document.body.classList.add("admin-mode");
    } else {
      document.body.classList.remove("admin-mode");
    }
  }, [pathname]);
  return null;
}

// ─── Public site ──────────────────────────────────────────────────────────────
function PublicSite() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <Hero />
      <About />

      {/* ① River — between About and Activities */}
      <ParallaxDivider {...PARALLAX.river} />

      <Activities />
      <Schedule />

      {/* ② Jungle — between Schedule and Reviews */}
      <ParallaxDivider {...PARALLAX.jungle} />

      <Reviews />

      {/* ③ Rafting action — between Reviews and Guidelines */}
      <ParallaxDivider {...PARALLAX.raft} />

      <Guidelines />

      {/* ④ Waterfall — between Guidelines and Booking */}
      <ParallaxDivider {...PARALLAX.waterfall} />

      <Booking />
      <Contact />
      <Footer />
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <BodyTheme />
      <Routes>
        <Route path="/"            element={<PublicSite />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={<ProtectedRoute><AdminApp /></ProtectedRoute>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}