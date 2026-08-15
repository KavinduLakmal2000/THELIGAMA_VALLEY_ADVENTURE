import { useState, useEffect, useRef } from "react";
import { activitiesApi, imgUrl } from "../api/client";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setHasMoved(true);
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag sensitivity
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    activitiesApi.getAll().then(r => setActivities(r.data)).catch(() => { }).finally(() => setLoading(false));
  }, []);

  return (
    <section id="activities" className="bg-stone-50 py-28 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="inline-block text-cyan-600 text-xl font-bold tracking-[0.35em] uppercase mb-4" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>— Outdoor Adventure —</span>
          <h2 className="text-stone-900 font-black leading-none mb-6" style={{ fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: "clamp(2.8rem,6vw,5rem)" }}>
            ADVENTURE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">ACTIVITIES</span>
          </h2>
          <p className="text-stone-500 text-xl max-w-xl mx-auto leading-relaxed" style={{ fontFamily: "'DM Sans',sans-serif" }}>
            Discover thrilling outdoor experiences in Theligama — designed for nature lovers, adrenaline seekers, and first-time explorers.
          </p>
        </div>

        {loading ? (
          <div className="flex gap-5 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[300px] bg-white rounded-2xl overflow-hidden border border-stone-200 animate-pulse">
                <div className="h-52 bg-stone-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-stone-100 rounded w-3/4" />
                  <div className="h-3 bg-stone-100 rounded w-1/2" />
                  <div className="h-4 bg-stone-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsDragging(false)}
            className={`flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pt-2 pb-8 px-1 ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: isDragging ? "auto" : "smooth" }}
          >
            {activities.map(act => (
              <div
                key={act._id}
                onClick={() => {
                  if (hasMoved) return;
                  setSelectedActivity(act);
                }}
                className="flex-shrink-0 w-[300px] snap-center group relative bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-cyan-300 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-100 cursor-pointer"              >
                <div className="relative h-52 overflow-hidden">
                  {imgUrl(act.image)
                    ? <img src={imgUrl(act.image)} alt={act.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    : <div className="w-full h-full bg-stone-100 flex items-center justify-center text-5xl">🏄</div>
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-cyan-500 text-white text-xl font-black tracking-widest uppercase px-3 py-1 rounded-full shadow" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>{act.tag}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-stone-900 font-black text-2xl uppercase mb-2 group-hover:text-cyan-600 transition-colors" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", letterSpacing: "0.05em" }}>{act.title}</h3>
                  <div className="flex items-center gap-3 text-stone-400 text-lg mb-4" style={{ fontFamily: "'DM Sans',sans-serif" }}>
                    <span>📍 {act.location}</span>
                    <span>⏱ {act.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-600 font-black text-4xl" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>LKR {act.price?.toLocaleString()}</span>
                    <a
                      href="#booking"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xl font-black tracking-widest uppercase text-stone-400 hover:text-cyan-600 transition-colors"
                      style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                    >
                      Book →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedActivity && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-[fadeIn_.25s_ease-out]"
            onClick={() => setSelectedActivity(null)}
          >
            <div
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl animate-[modalPop_.3s_ease-out]"
              onClick={(e) => e.stopPropagation()}
            >

              {/* Close button */}
              <button
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-2xl transition-all"
              >
                ×
              </button>

              {/* Large image */}
              <div className="relative h-[280px] sm:h-[400px] overflow-hidden rounded-t-3xl">

                {imgUrl(selectedActivity.image) ? (
                  <img
                    src={imgUrl(selectedActivity.image)}
                    alt={selectedActivity.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-100 flex items-center justify-center text-7xl">
                    🏄
                  </div>
                )}

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Badge */}
                <div className="absolute bottom-5 left-6">
                  <span
                    className="bg-cyan-500 text-white text-xl font-black tracking-widest uppercase px-4 py-2 rounded-full shadow-lg"
                    style={{
                      fontFamily: "'Bebas Neue', 'Impact', sans-serif"
                    }}
                  >
                    {selectedActivity.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-10">

                {/* Title */}
                <h2
                  className="text-stone-900 text-4xl sm:text-6xl font-black uppercase leading-none mb-8"
                  style={{
                    fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                    letterSpacing: "0.04em"
                  }}
                >
                  {selectedActivity.title}
                </h2>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

                  {/* Location */}
                  <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200">
                    <div className="text-stone-400 text-sm uppercase tracking-widest mb-1">
                      Location
                    </div>

                    <div
                      className="text-stone-900 text-xl font-bold"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      📍 {selectedActivity.location}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200">
                    <div className="text-stone-400 text-sm uppercase tracking-widest mb-1">
                      Activity Time
                    </div>

                    <div
                      className="text-stone-900 text-xl font-bold"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      ⏱️ {selectedActivity.duration}
                    </div>
                  </div>

                  {/* Minimum age */}
                  <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200">
                    <div className="text-stone-400 text-sm uppercase tracking-widest mb-1">
                      Minimum Age
                    </div>

                    <div
                      className="text-stone-900 text-xl font-bold"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      👤 {selectedActivity.minAge} Years Old
                    </div>
                  </div>

                  {/* Maximum guests */}
                  <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200">
                    <div className="text-stone-400 text-sm uppercase tracking-widest mb-1">
                      Maximum Guests
                    </div>

                    <div
                      className="text-stone-900 text-xl font-bold"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      👥 {selectedActivity.maxGuests} Guests
                    </div>
                  </div>

                </div>

                {/* Price + Book */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 pt-6 border-t border-stone-200">

                  <div>
                    <div
                      className="text-stone-400 uppercase tracking-widest text-sm mb-1"
                    >
                      Price Per Person
                    </div>

                    <div
                      className="text-cyan-600 text-5xl font-black"
                      style={{
                        fontFamily: "'Bebas Neue', 'Impact', sans-serif"
                      }}
                    >
                      LKR {selectedActivity.price?.toLocaleString()}
                    </div>
                  </div>

                  <a
                    href="#booking"
                    onClick={() => setSelectedActivity(null)}
                    className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-8 py-4 rounded-xl text-xl font-black tracking-widest uppercase shadow-lg hover:shadow-xl transition-all"
                    style={{
                      fontFamily: "'Bebas Neue', 'Impact', sans-serif"
                    }}
                  >
                    Book Now →
                  </a>

                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


// make image on same 400px the decrace the size of details 