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

export default function App() {
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
