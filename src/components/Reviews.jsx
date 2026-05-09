import { reviews } from "../data/data";

export default function Reviews() {
  return (
    <section id="reviews" className="bg-stone-900 py-28 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-700 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span
            className="inline-block text-cyan-400 text-xs font-bold tracking-[0.35em] uppercase mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            — Guest Experiences —
          </span>
          <h2
            className="text-white font-black mb-6"
            style={{
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
            }}
          >
            WHAT OUR{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
              ADVENTURERS
            </span>{" "}
            SAY
          </h2>
          <p className="text-stone-400 text-lg max-w-xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Hear from travelers who experienced unforgettable adventures with us in Kithulgala.
          </p>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div
              key={review.id}
              className={`group relative bg-stone-950/80 border border-stone-800 hover:border-cyan-500/30 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 ${i === 0 ? "lg:col-span-1 md:col-span-2 lg:md:col-span-1" : ""}`}
            >
              {/* Quote mark */}
              <div
                className="text-cyan-500/20 font-black leading-none mb-4 select-none"
                style={{ fontFamily: "'Georgia', serif", fontSize: "5rem", lineHeight: 0.8 }}
              >
                "
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <span
                    key={j}
                    className={j < review.rating ? "text-amber-400" : "text-stone-700"}
                    style={{ fontSize: "1rem" }}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p
                className="text-stone-300 text-sm leading-relaxed mb-6"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {review.text}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-stone-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-stone-950 font-black text-sm">
                  {review.avatar}
                </div>
                <div>
                  <p className="text-white font-black text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {review.name}
                  </p>
                  <p className="text-stone-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {review.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall rating */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-stone-950/60 border border-stone-800 rounded-2xl px-8 py-5">
            <div>
              <div
                className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
              >
                4.9
              </div>
              <div className="flex gap-0.5 mt-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400">★</span>
                ))}
              </div>
            </div>
            <div className="w-px h-12 bg-stone-700" />
            <div className="text-left">
              <p className="text-white font-black text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>Overall Rating</p>
              <p className="text-stone-400 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Based on 500+ reviews</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
