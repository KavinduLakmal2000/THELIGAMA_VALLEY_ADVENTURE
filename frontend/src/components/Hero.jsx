import { hero } from "../data/data";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={hero.video}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-stone-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 via-transparent to-transparent" />

      {/* Animated noise texture overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* Floating water particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-cyan-400/10 blur-3xl animate-pulse"
          style={{
            width: `${120 + i * 40}px`,
            height: `${120 + i * 40}px`,
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 20}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${3 + i}s`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span
              className="text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Sri Lanka's Premier Adventure
            </span>
          </div>

          {/* Tagline */}
          <p
            className="text-cyan-300/80 text-lg font-semibold tracking-[0.3em] uppercase mb-3"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {hero.tagline}
          </p>

          {/* Title */}
          <h1
            className="text-white font-black leading-none mb-6"
            style={{
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              fontSize: "clamp(3.5rem, 8vw, 7rem)",
              lineHeight: 1,
              textShadow: "0 4px 40px rgba(0,0,0,0.5)",
            }}
          >
            THELIGAMA VALLEY
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
              ADVENTURE
            </span>
            <br />
            LODGE
          </h1>

          {/* Subtitle */}
          <p
            className="text-stone-300 text-xl leading-relaxed mb-10 max-w-xl"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {hero.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-12">
            <a
              href={hero.cta.href}
              className="group px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-stone-950 font-black text-sm tracking-widest uppercase rounded-full transition-all duration-200 shadow-xl shadow-cyan-500/40 hover:shadow-cyan-400/60 hover:scale-105 flex items-center gap-2"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {hero.cta.label}
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </a>
            <a
              href="#booking"
              className="px-8 py-4 border border-white/30 hover:border-cyan-400/60 text-white hover:text-cyan-400 font-bold text-sm tracking-widest uppercase rounded-full transition-all duration-200 backdrop-blur-sm hover:bg-cyan-400/5"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Book Now
            </a>
          </div>

          {/* Hours badge */}
          <div className="flex items-center gap-3 text-stone-400 text-sm">
            <span className="text-xl">🕐</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <strong className="text-stone-200">Hours</strong> · {hero.hours}
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-stone-400 text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "'Syne', sans-serif" }}>Scroll</span>
        <div className="w-0.5 h-10 bg-gradient-to-b from-cyan-400 to-transparent" />
      </div>
    </section>
  );
}
