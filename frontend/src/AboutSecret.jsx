import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function AboutSecret() {
  useEffect(() => {
    document.title = "Behind the Scenes — Alpine To Island";
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#071111] text-white flex items-center justify-center p-6">

      {/* Floating background shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-[float_10s_ease-in-out_infinite]" />
        <div className="absolute top-1/4 -right-40 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl animate-[float_13s_ease-in-out_infinite_reverse]" />
        <div className="absolute -bottom-40 left-1/3 w-[28rem] h-[28rem] rounded-full bg-cyan-400/5 blur-3xl animate-[float_16s_ease-in-out_infinite]" />

        <div className="absolute top-[12%] left-[12%] w-3 h-3 rounded-full bg-cyan-300/40 blur-[1px] animate-[pulse_4s_ease-in-out_infinite]" />
        <div className="absolute top-[20%] right-[18%] w-2 h-2 rounded-full bg-teal-300/50 animate-[pulse_5s_ease-in-out_infinite]" />
        <div className="absolute bottom-[18%] left-[20%] w-2 h-2 rounded-full bg-cyan-400/30 animate-[pulse_6s_ease-in-out_infinite]" />

        <div className="absolute top-[8%] right-[35%] w-24 h-24 rounded-full border border-cyan-400/10 animate-[float_12s_ease-in-out_infinite]" />
        <div className="absolute bottom-[10%] right-[12%] w-40 h-40 rounded-full border border-teal-400/10 animate-[float_15s_ease-in-out_infinite_reverse]" />

        <div className="absolute top-[42%] left-[5%] w-16 h-16 rounded-2xl border border-white/5 rotate-12 animate-[float_9s_ease-in-out_infinite]" />
        <div className="absolute bottom-[25%] right-[7%] w-20 h-20 rounded-3xl border border-cyan-300/10 -rotate-12 animate-[float_11s_ease-in-out_infinite_reverse]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl w-full">

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.45)] p-8 md:p-10 animate-[fadeUp_.8s_ease-out]">

          {/* Glow */}
          <div className="absolute -top-24 right-0 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

          {/* Floating logo */}
          <div className="absolute -top-8 right-8 md:right-12 w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-3xl shadow-[0_15px_40px_rgba(34,211,238,0.25)] rotate-6 animate-[float_5s_ease-in-out_infinite]">
            🌊
          </div>

          <div className="relative">

            {/* Small label */}
            <div
              className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 text-cyan-300 text-xs font-bold tracking-[0.2em] uppercase"
              style={{ fontFamily: "'DM Sans',sans-serif" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
              Hidden corner
            </div>

            <h1
              className="text-white font-black text-4xl md:text-6xl leading-none mb-4"
              style={{
                fontFamily: "'Bebas Neue','Impact',sans-serif",
              }}
            >
              You found a
              <span className="block text-cyan-300">
                hidden corner.
              </span>
            </h1>

            <p
              className="text-white/60 text-sm md:text-base max-w-2xl mb-8 leading-relaxed"
              style={{ fontFamily: "'DM Sans',sans-serif" }}
            >
              Nicely done — this is a tiny little secret tucked away by the
              developer. Nothing too serious. Just something for the curious.
            </p>

            {/* Cards */}
            <div className="grid md:grid-cols-2 gap-5">

              {/* Project */}
              <div className="group bg-white/[0.035] border border-white/[0.08] rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.06] hover:border-cyan-300/20">
                <div className="text-2xl mb-4">🏔️</div>

                <h3
                  className="text-white font-bold text-lg mb-2"
                  style={{ fontFamily: "'Syne',sans-serif" }}
                >
                  About the Project
                </h3>

                <p
                  className="text-white/50 text-sm leading-relaxed"
                  style={{ fontFamily: "'DM Sans',sans-serif" }}
                >
                  Alpine To Island is a lightweight rafting booking experience
                  built to showcase guided adventures, bookings, and the tools
                  behind the scenes.
                </p>
              </div>

              {/* Technology */}
              <div className="group bg-white/[0.035] border border-white/[0.08] rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.06] hover:border-cyan-300/20">
                <div className="text-2xl mb-4">⚙️</div>

                <h3
                  className="text-white font-bold text-lg mb-2"
                  style={{ fontFamily: "'Syne',sans-serif" }}
                >
                  Built With
                </h3>

                <p
                  className="text-white/50 text-sm leading-relaxed"
                  style={{ fontFamily: "'DM Sans',sans-serif" }}
                >
                  React, Vite, Tailwind CSS, Express, MongoDB, and a bunch of
                  late-night debugging. Simple technology, carefully put
                  together.
                </p>
              </div>

              {/* Creator */}
              <div className="group bg-white/[0.035] border border-white/[0.08] rounded-2xl p-6 transition-all duration-500 hover:scale-[1.015] hover:bg-white/[0.06] hover:border-cyan-300/20">
                <div className="text-2xl mb-4">✦</div>

                <h3
                  className="text-white font-bold text-lg mb-2"
                  style={{ fontFamily: "'Syne',sans-serif" }}
                >
                  Creator
                </h3>

                <p
                  className="text-white/50 text-sm leading-relaxed"
                  style={{ fontFamily: "'DM Sans',sans-serif" }}
                >
                  Crafted with care by <span className="text-cyan-300">KLTchnology</span>.
                  Thanks for taking the time to explore a little deeper.
                </p>
              </div>

              {/* Behind the Build */}
              <div className="group bg-gradient-to-br from-cyan-400/[0.08] to-teal-400/[0.03] border border-cyan-300/10 rounded-2xl p-6 transition-all duration-500 hover:scale-[1.015] hover:border-cyan-300/25">
                <div className="text-2xl mb-4">⌘</div>

                <h3
                  className="text-white font-bold text-lg mb-2"
                  style={{ fontFamily: "'Syne',sans-serif" }}
                >
                  Behind the Build
                </h3>

                <p
                  className="text-white/50 text-sm leading-relaxed"
                  style={{ fontFamily: "'DM Sans',sans-serif" }}
                >
                  Every polished interface has a messy side — ideas,
                  experiments, bugs, fixes, and plenty of{" "}
                  <span className="text-white/70">"why isn't this working?"</span>{" "}
                  moments.
                </p>
              </div>
            </div>

            {/* Bottom */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-5">

              <Link
                to="/"
                className="group px-6 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-[#071111] font-black text-xs tracking-[0.18em] uppercase rounded-full transition-all duration-300 shadow-[0_10px_30px_rgba(34,211,238,0.2)] hover:shadow-[0_15px_40px_rgba(34,211,238,0.3)] hover:-translate-y-0.5"
              >
                Back to site
                <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <div
                className="text-white/30 text-xs text-center"
                style={{ fontFamily: "'DM Sans',sans-serif" }}
              >
                Hidden with <span className="text-cyan-300/70">♥</span> — Alpine
                To Island
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-6 text-center text-white/20 text-xs"
          style={{ fontFamily: "'DM Sans',sans-serif" }}
        >
          <em>For the curious ones.</em>
        </div>
      </div>

      {/* Custom animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-14px) rotate(3deg);
            }
          }

          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(24px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}