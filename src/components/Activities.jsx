import { activities } from "../data/data";

export default function Activities() {
  return (
    <section id="activities" className="bg-stone-900 py-28 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span
            className="inline-block text-cyan-400 text-xs font-bold tracking-[0.35em] uppercase mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            — Outdoor Adventure —
          </span>
          <h2
            className="text-white font-black leading-none mb-6"
            style={{
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
            }}
          >
            ADVENTURE{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
              ACTIVITIES
            </span>
          </h2>
          <p
            className="text-stone-400 text-lg max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Discover thrilling outdoor experiences in Kithulgala, Sri Lanka — designed for nature lovers, adrenaline seekers, and first-time explorers.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {activities.map((act) => (
            <div
              key={act.id}
              className="group relative bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 hover:border-cyan-500/40 transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/15 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={act.image}
                  alt={act.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                {/* Tag badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className="bg-cyan-500/90 text-stone-950 text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {act.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3
                  className="text-white font-black text-lg mb-2 group-hover:text-cyan-400 transition-colors"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {act.title}
                </h3>
                <div className="flex items-center gap-3 text-stone-400 text-xs mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <span className="flex items-center gap-1">
                    <span>📍</span> {act.location}
                  </span>
                  <span className="text-stone-700">·</span>
                  <span className="flex items-center gap-1">
                    <span>⏱</span> {act.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="text-cyan-400 font-black text-lg"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {act.price}
                  </span>
                  <a
                    href="#booking"
                    className="text-xs font-black tracking-widest uppercase text-stone-400 hover:text-cyan-400 transition-colors"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    Book →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
