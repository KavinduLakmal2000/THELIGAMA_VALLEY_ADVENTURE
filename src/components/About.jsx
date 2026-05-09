import { about } from "../data/data";

export default function About() {
  return (
    <section id="about" className="bg-stone-950 py-28 px-6 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span
            className="inline-block text-cyan-400 text-xs font-bold tracking-[0.35em] uppercase mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            — {about.badge} —
          </span>
          <h2
            className="text-white font-black leading-none mb-6"
            style={{
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
            }}
          >
            KITHULGALA{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
              RIVER
            </span>{" "}
            ADVENTURES
          </h2>
          <p
            className="text-stone-400 text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {about.description}
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {about.features.map((feat, i) => (
            <div
              key={i}
              className="group relative bg-stone-900/60 border border-stone-800 hover:border-cyan-500/40 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10 overflow-hidden"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-teal-400 group-hover:w-full transition-all duration-500" />

              <div className="text-4xl mb-4">{feat.icon}</div>
              <h3
                className="text-white font-black text-xl mb-3"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {feat.title}
              </h3>
              <p
                className="text-stone-400 text-sm leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {feat.text}
              </p>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "10+", label: "Activities" },
            { value: "5000+", label: "Happy Adventurers" },
            { value: "100%", label: "Safety Record" },
            { value: "365", label: "Days Open" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 bg-stone-900/40 rounded-2xl border border-stone-800/60">
              <div
                className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300 mb-1"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", fontSize: "3rem" }}
              >
                {stat.value}
              </div>
              <div
                className="text-stone-400 text-xs tracking-widest uppercase font-semibold"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
