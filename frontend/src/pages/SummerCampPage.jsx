import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { summerCamp } from "../data/summerCampData";
import Footer from "../components/Footer";

const display = { fontFamily: "'Bebas Neue','Impact',sans-serif" };
const body = { fontFamily: "'DM Sans',sans-serif" };
const ui = { fontFamily: "'Syne',sans-serif" };

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Fades + slides an element up into place the first time it enters the viewport.
function Reveal({ children, delay = 0, className = "", as: Tag = "div", ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (prefersReducedMotion() || visible) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s cubic-bezier(.22,.61,.36,1) ${delay}ms, transform 0.7s cubic-bezier(.22,.61,.36,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Draws the dashed trail line left-to-right once it scrolls into view.
function TrailLine() {
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (prefersReducedMotion() || drawn) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [drawn]);

  return (
    <div
      ref={ref}
      className="absolute top-[52px] left-[12.5%] right-[12.5%] h-0.5 overflow-hidden"
    >
      <div
        className="h-full"
        style={{
          backgroundImage: "repeating-linear-gradient(to right, #06b6d4 0, #06b6d4 10px, transparent 10px, transparent 20px)",
          transform: drawn ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 1.1s cubic-bezier(.22,.61,.36,1) 0.15s",
        }}
      />
    </div>
  );
}

export default function SummerCampPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
    if (location.state?.scrollTo === "pillars") {
      const element = document.getElementById("pillars");

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }
  }, [location, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Navigate home, then smooth-scroll to a section id once the home page has mounted.
  const goHomeAndScroll = (id) => (e) => {
    e.preventDefault();
    navigate("/", { state: { scrollTo: id } });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* ── Minimal page header ─────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md py-4 px-6 transition-shadow duration-300 ${scrolled ? "shadow-lg shadow-stone-200/60 border-b border-stone-100" : "border-b border-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-stone-600 hover:text-cyan-600 transition-colors group">
            <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:-translate-x-1">←</span>
            <span className="text-sm font-bold tracking-widest uppercase" style={ui}>Back to Home</span>
          </Link>
          <button
            onClick={goHomeAndScroll("booking")}
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-black text-xs tracking-widest uppercase rounded-full transition-all duration-200 shadow-md shadow-cyan-500/30 hover:scale-105 active:scale-95"
            style={ui}
          >
            Book Now
          </button>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[85vh] min-h-[560px] flex items-end overflow-hidden">
        <img
          src={summerCamp.heroImage}
          alt="Theligama Summer Camp — Kelani River valley"
          className="absolute inset-0 w-full h-full object-cover animate-[heroZoom_9s_ease-out_forwards]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

        {/* <div
          className="absolute top-28 right-6 sm:right-10 w-28 h-28 rounded-full border-2 border-dashed border-white/70 flex items-center justify-center text-center p-3 rotate-[10deg] animate-[float_5s_ease-in-out_infinite]"
          style={display}
        >
          <span className="text-white text-xs leading-tight tracking-widest uppercase">
            Est. Camp<br />Sri Lanka
          </span>
        </div> */}

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full">
          <Reveal>
            <span className="inline-block text-cyan-300 text-xl font-bold tracking-[0.35em] uppercase mb-4" style={display}>
              — {summerCamp.eyebrow} —
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="text-white font-black leading-[0.9] mb-6" style={{ ...display, fontSize: "clamp(3rem,9vw,7.5rem)" }}>
              SUMMER <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">CAMP</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-white/85 text-xl md:text-2xl max-w-2xl leading-relaxed" style={body}>
              {summerCamp.tagline} — one guided week in the Kelani River valley.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Intro ────────────────────────────────────────────────────────── */}
      <section className="bg-white py-24 px-6">
        <Reveal className="max-w-4xl mx-auto text-center" as="div">
          <p className="text-stone-600 text-xl md:text-2xl leading-relaxed" style={body}>
            {summerCamp.intro}
          </p>
        </Reveal>
      </section>

      {/* ── Four Pillars — the Base Camp Trail ──────────────────────────── */}
      <section id="pillars" className="bg-stone-50 py-28 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-20">
            <span className="inline-block text-cyan-600 text-xl font-bold tracking-[0.35em] uppercase mb-4" style={display}>
              — The Base Camp Trail —
            </span>
            <h2 className="text-stone-900 font-black leading-none mb-6" style={{ ...display, fontSize: "clamp(2.8rem,6vw,5rem)" }}>
              FOUR WORLDS, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">ONE CAMP</span>
            </h2>
            <p className="text-stone-500 text-xl max-w-2xl mx-auto leading-relaxed" style={body}>
              Every camp moves through four checkpoints. Each one stands alone — together, they're what makes this more than an adventure trip.
            </p>
          </Reveal>

          {/* Trail line (desktop) */}
          <div className="hidden lg:block relative">
            <TrailLine />
            <div className="grid grid-cols-4 gap-8 relative">
              {summerCamp.pillars.map((p, i) => (
                <Reveal key={p.key} delay={i * 130}>
                  <PillarStop p={p} />
                </Reveal>
              ))}
            </div>
          </div>

          {/* Stacked (mobile/tablet) */}
          <div className="lg:hidden grid sm:grid-cols-2 gap-8">
            {summerCamp.pillars.map((p, i) => (
              <Reveal key={p.key} delay={i * 100}>
                <PillarStop p={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's for ─────────────────────────────────────────────────── */}
      <section className="bg-white py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <span className="inline-block text-cyan-600 text-xl font-bold tracking-[0.35em] uppercase mb-4" style={display}>
              — Built For —
            </span>
            <h2 className="text-stone-900 font-black leading-none mb-6" style={{ ...display, fontSize: "clamp(2.8rem,6vw,5rem)" }}>
              WHO IT'S <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">FOR</span>
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {summerCamp.audiences.map((a, i) => (
              <Reveal key={a.title} delay={i * 100}>
                <div className="bg-white border border-stone-200 hover:border-cyan-300 rounded-[2rem] p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-100/50 h-full">
                  <div className="text-4xl mb-5 transition-transform duration-300 group-hover:scale-110">{a.icon}</div>
                  <h3 className="text-stone-900 font-black text-2xl uppercase mb-3" style={{ ...display, letterSpacing: "0.05em" }}>
                    {a.title}
                  </h3>
                  <p className="text-stone-500 text-base leading-relaxed" style={body}>{a.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── What makes it different ──────────────────────────────────────── */}
      <section className="bg-stone-50 py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-14">
            <span className="inline-block text-cyan-600 text-xl font-bold tracking-[0.35em] uppercase mb-4" style={display}>
              — The Difference —
            </span>
            <h2 className="text-stone-900 font-black leading-none mb-6" style={{ ...display, fontSize: "clamp(2.8rem,6vw,5rem)" }}>
              NOT JUST <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">RAFTING</span>
            </h2>
            <p className="text-stone-500 text-xl leading-relaxed" style={body}>{summerCamp.differenceIntro}</p>
          </Reveal>

          <Reveal className="bg-white border border-stone-200 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 bg-stone-900 text-white">
              <div className="p-4 text-sm font-bold tracking-widest uppercase" style={ui}></div>
              <div className="p-4 text-sm font-bold tracking-widest uppercase text-center border-l border-stone-700" style={ui}>Typical Trip</div>
              <div className="p-4 text-sm font-bold tracking-widest uppercase text-center border-l border-stone-700 text-cyan-300" style={ui}>Summer Camp</div>
            </div>
            {summerCamp.difference.map((row, i) => (
              <Reveal
                key={row.label}
                as="div"
                delay={i * 60}
                className={`grid grid-cols-3 items-center ${i % 2 === 0 ? "bg-white" : "bg-stone-50"}`}
              >
                <div className="p-4 text-stone-800 font-semibold text-sm sm:text-base" style={body}>{row.label}</div>
                <div className="p-4 text-center border-l border-stone-100">
                  {row.typical ? <Check /> : <Dash />}
                </div>
                <div className="p-4 text-center border-l border-stone-100">
                  {row.camp ? <Check good /> : <Dash />}
                </div>
              </Reveal>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Journey ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <span className="inline-block text-cyan-600 text-xl font-bold tracking-[0.35em] uppercase mb-4" style={display}>
              — The Journey —
            </span>
            <h2 className="text-stone-900 font-black leading-none mb-6" style={{ ...display, fontSize: "clamp(2.8rem,6vw,5rem)" }}>
              BEFORE, DURING <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">& AFTER</span>
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {summerCamp.journey.map((j, i) => (
              <Reveal key={j.stage} delay={i * 120}>
                <div className="bg-stone-50 border border-stone-100 rounded-[2rem] p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-stone-200/60 h-full">
                  <div className="text-4xl mb-4">{j.icon}</div>
                  <h3 className="text-stone-900 font-black text-2xl uppercase mb-5" style={{ ...display, letterSpacing: "0.05em" }}>
                    {j.stage}
                  </h3>
                  <ul className="space-y-2 text-left inline-block">
                    {j.items.map((it) => (
                      <li key={it} className="text-stone-500 text-base flex items-start gap-2" style={body}>
                        <span className="text-cyan-500 mt-1">•</span>{it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sustainability strip ─────────────────────────────────────────── */}
      <section className="bg-teal-600 py-16 px-6 overflow-hidden">
        <Reveal className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="text-6xl shrink-0 animate-[float_4s_ease-in-out_infinite]">{summerCamp.sustainability.icon}</div>
          <div>
            <h3 className="text-white font-black text-3xl uppercase mb-2" style={{ ...display, letterSpacing: "0.05em" }}>
              {summerCamp.sustainability.title}
            </h3>
            <p className="text-teal-50 text-lg leading-relaxed" style={body}>{summerCamp.sustainability.text}</p>
          </div>
        </Reveal>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="bg-stone-900 py-24 px-6 text-center">
        <Reveal className="max-w-2xl mx-auto">
          <h2 className="text-white font-black leading-none mb-6" style={{ ...display, fontSize: "clamp(2.4rem,5vw,4rem)" }}>
            {summerCamp.cta.title}
          </h2>
          <p className="text-stone-400 text-xl mb-10" style={body}>{summerCamp.cta.text}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={goHomeAndScroll(summerCamp.cta.primary.scrollTo)}
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-black text-sm tracking-widest uppercase rounded-full transition-all duration-200 shadow-md shadow-cyan-500/30 hover:scale-105 active:scale-95"
              style={ui}
            >
              {summerCamp.cta.primary.label}
            </button>
            <button
              onClick={goHomeAndScroll(summerCamp.cta.secondary.scrollTo)}
              className="px-8 py-4 bg-transparent border border-stone-600 hover:border-cyan-400 text-white font-black text-sm tracking-widest uppercase rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
              style={ui}
            >
              {summerCamp.cta.secondary.label}
            </button>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}

function PillarStop({ p }) {
  return (
    <div className="relative flex flex-col items-center text-center group">
      <div
        className="w-[104px] h-[104px] rounded-full bg-white border-2 border-cyan-500 flex items-center justify-center text-4xl shadow-lg shadow-cyan-100 mb-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
      >
        {p.icon}
        <span
          className="absolute -bottom-2 -right-1 bg-cyan-500 text-white text-[11px] font-black w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-125"
          style={display}
        >
          {p.step}
        </span>
      </div>

      <div className="bg-white border border-stone-200 group-hover:border-cyan-300 rounded-[2rem] overflow-hidden w-full transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-cyan-100/50">
        <div className="h-36 overflow-hidden">
          <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        </div>
        <div className="p-6 text-left">
          <h3 className="text-stone-900 font-black text-2xl uppercase mb-2" style={{ fontFamily: "'Bebas Neue','Impact',sans-serif", letterSpacing: "0.05em" }}>
            {p.title}
          </h3>
          <p className="text-stone-500 text-sm mb-4 leading-relaxed" style={body}>{p.blurb}</p>
          <ul className="space-y-1.5">
            {p.highlights.map((h) => (
              <li key={h} className="text-stone-600 text-sm flex items-start gap-2" style={body}>
                <span className="text-cyan-500 mt-0.5">✓</span>{h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Check({ good }) {
  return <span className={`text-xl ${good ? "text-teal-500" : "text-stone-400"}`}>✓</span>;
}
function Dash() {
  return <span className="text-stone-300 text-xl">—</span>;
}
