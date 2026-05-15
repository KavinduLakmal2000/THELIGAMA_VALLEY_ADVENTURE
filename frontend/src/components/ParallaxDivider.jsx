import { useRef, useEffect, useState } from "react";

/**
 * ParallaxDivider
 *
 * Props:
 *   image      — full URL of the background image
 *   height     — section height, default "500px"
 *   speed      — parallax intensity 0–1, default 0.4
 *   overlay    — overlay opacity 0–1, default 0.45
 *   quote      — optional bold quote text
 *   quoteSmall — optional small caption below quote
 *   position   — CSS background-position string, default "center center"
 */
export default function ParallaxDivider({
  image,
  height     = "500px",
  speed      = 0.4,
  overlay    = 0.45,
  quote,
  quoteSmall,
  position   = "center center",
}) {
  const ref       = useRef(null);
  const [offset, setOffset] = useState(0);
  const rafRef    = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Prefetch image so it's ready before user scrolls to it
    const img = new Image();
    img.src = image;

    const update = () => {
      const rect  = el.getBoundingClientRect();
      const vh    = window.innerHeight;
      // How far the element centre is from the viewport centre
      const delta = (rect.top + rect.height / 2) - vh / 2;
      setOffset(delta * speed);
    };

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    update(); // run once on mount
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update,   { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [image, speed]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden w-full"
      style={{ height }}
    >
      {/* Parallax image layer */}
      <div
        className="absolute inset-x-0"
        style={{
          top:             "-20%",
          bottom:          "-20%",
          backgroundImage:    `url(${image})`,
          backgroundSize:     "cover",
          backgroundPosition: position,
          backgroundRepeat:   "no-repeat",
          transform:          `translateY(${offset}px)`,
          willChange:         "transform",
          transition:         "transform 0.05s linear",
        }}
      />

      {/* Gradient overlay — light at edges, darker in centre */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(255,255,255,0.18) 0%,
            rgba(0,0,0,${overlay}) 40%,
            rgba(0,0,0,${overlay}) 60%,
            rgba(255,255,255,0.18) 100%
          )`,
        }}
      />

      {/* Subtle top and bottom fade to white so sections blend */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />

      {/* Optional quote overlay */}
      {quote && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          {/* Decorative line */}
          <div className="w-12 h-0.5 bg-cyan-400 mb-6 opacity-80" />

          <p
            className="text-white font-black leading-tight drop-shadow-lg max-w-3xl"
            style={{
              fontFamily:  "'Bebas Neue', 'Impact', sans-serif",
              fontSize:    "clamp(2rem, 5vw, 4rem)",
              letterSpacing: "0.04em",
              textShadow:  "0 2px 24px rgba(0,0,0,0.6)",
            }}
          >
            {quote}
          </p>

          {quoteSmall && (
            <p
              className="text-white/70 text-sm mt-4 tracking-widest uppercase"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {quoteSmall}
            </p>
          )}

          <div className="w-12 h-0.5 bg-cyan-400 mt-6 opacity-80" />
        </div>
      )}
    </div>
  );
}
