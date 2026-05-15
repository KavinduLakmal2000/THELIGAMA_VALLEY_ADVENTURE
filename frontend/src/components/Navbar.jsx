import { useState, useEffect } from "react";
import { navLinks } from "../data/data";

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? "bg-white/95 backdrop-blur-md shadow-lg shadow-stone-200/60 py-3 border-b border-stone-100"
        : "bg-transparent py-5"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-xl shadow-md shadow-cyan-500/30">🌊</div>
          <span className="font-black text-xl tracking-tight" style={{ fontFamily:"'Bebas Neue','Impact',sans-serif", letterSpacing:"0.05em", color: scrolled ? "#0c0a09" : "#ffffff" }}>
            KithulGala<span className="text-cyan-500"> Adventures</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map(link => (
            <li key={link.label}>
              <a href={link.href}
                className={`text-sm font-semibold tracking-widest uppercase transition-colors duration-200 relative group ${scrolled ? "text-stone-600 hover:text-cyan-600" : "text-white/90 hover:text-white"}`}
                style={{ fontFamily:"'Syne',sans-serif" }}>
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-300" />
              </a>
            </li>
          ))}
          <li>
            <a href="#booking"
              className="ml-4 px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-black text-sm tracking-widest uppercase rounded-full transition-all shadow-md shadow-cyan-500/30 hover:shadow-cyan-600/40 hover:scale-105"
              style={{ fontFamily:"'Syne',sans-serif" }}>
              Book Now
            </a>
          </li>
        </ul>

        {/* Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden flex flex-col gap-1.5 p-2" aria-label="Toggle menu">
          {[1,2,3].map(i => (
            <span key={i} className={`block w-6 h-0.5 transition-all duration-300 ${scrolled ? "bg-stone-800" : "bg-white"} ${i===1&&menuOpen?"rotate-45 translate-y-2":""} ${i===2&&menuOpen?"opacity-0":""} ${i===3&&menuOpen?"-rotate-45 -translate-y-2":""}`} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden bg-white border-t border-stone-100 overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96 shadow-lg" : "max-h-0"}`}>
        <ul className="flex flex-col px-6 py-4 gap-4">
          {navLinks.map(link => (
            <li key={link.label}>
              <a href={link.href} onClick={() => setMenuOpen(false)}
                className="text-stone-600 hover:text-cyan-600 text-sm font-semibold tracking-widest uppercase transition-colors block"
                style={{ fontFamily:"'Syne',sans-serif" }}>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#booking" onClick={() => setMenuOpen(false)}
              className="inline-block px-5 py-2 bg-cyan-500 text-white font-black text-sm tracking-widest uppercase rounded-full mt-2">
              Book Now
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
