import { Link } from "react-router-dom";
import { summerCamp } from "../data/summerCampData";

export default function SummerCampTeaser() {
  return (
    <section id="summer-camp" className="bg-gray-100 py-28 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-50 rounded-full blur-3xl opacity-60" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* ── Image side ─────────────────────────────────────────────── */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5] max-w-md mx-auto lg:mx-0">
              <img
                src={summerCamp.heroImage}
                alt="Theligama Summer Camp"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />

              {/* Passport-stamp style badge */}
              <div
                className="absolute top-6 left-6 w-24 h-24 rounded-full border-2 border-dashed border-white/80 flex items-center justify-center text-center p-2 rotate-[-12deg]"
                style={{ fontFamily: "'Bebas Neue','Impact',sans-serif" }}
              >
                <span className="text-white text-xs leading-tight tracking-widest uppercase">
                  Est. Camp<br />Sri Lanka
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex gap-2">
                {summerCamp.pillars.map((p) => (
                  <Link
                    key={p.key}
                    to="/summer-camp"
                    className="flex-1 text-center bg-white/90 backdrop-blur-sm rounded-xl py-2 text-xl hover:bg-white hover:scale-105 transition-all cursor-pointer"
                    title={p.title}
                  >
                    {p.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── Copy side ──────────────────────────────────────────────── */}
          <div className="order-1 lg:order-2">
            <span
              className="inline-block text-cyan-600 text-xl font-bold tracking-[0.35em] uppercase mb-4"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
            >
              — {summerCamp.eyebrow} —
            </span>
            <h2
              className="text-stone-900 font-black leading-none mb-6"
              style={{ fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: "clamp(2.8rem,6vw,5rem)" }}
            >
              {summerCamp.title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">
                EXPERIENCE
              </span>
            </h2>
            <p className="text-stone-500 text-xl leading-relaxed mb-8 max-w-xl" style={{ fontFamily: "'DM Sans',sans-serif" }}>
              {summerCamp.teaserText}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10 max-w-lg">
              {summerCamp.pillars.map((p) => (
                <div key={p.key} className="flex items-center gap-3">
                  <span className="text-2xl">{p.icon}</span>
                  <span
                    className="text-stone-700 text-sm font-bold tracking-widest uppercase"
                    style={{ fontFamily: "'Syne',sans-serif" }}
                  >
                    {p.title}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/summer-camp"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-cyan-500 hover:bg-cyan-600 text-white font-black text-sm tracking-widest uppercase rounded-full transition-all shadow-md shadow-cyan-500/30 hover:shadow-cyan-600/40 hover:scale-105"
              style={{ fontFamily: "'Syne',sans-serif" }}
            >
              See More <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
