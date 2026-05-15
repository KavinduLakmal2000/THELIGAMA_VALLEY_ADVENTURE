import { useState, useEffect } from "react";
import { activitiesApi, imgUrl } from "../api/client";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    activitiesApi.getAll().then(r => setActivities(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <section id="activities" className="bg-stone-50 py-28 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="inline-block text-cyan-600 text-xs font-bold tracking-[0.35em] uppercase mb-4" style={{ fontFamily:"'Syne',sans-serif" }}>— Outdoor Adventure —</span>
          <h2 className="text-stone-900 font-black leading-none mb-6" style={{ fontFamily:"'Bebas Neue','Impact',sans-serif", fontSize:"clamp(2.8rem,6vw,5rem)" }}>
            ADVENTURE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">ACTIVITIES</span>
          </h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto leading-relaxed" style={{ fontFamily:"'DM Sans',sans-serif" }}>
            Discover thrilling outdoor experiences in Kithulgala — designed for nature lovers, adrenaline seekers, and first-time explorers.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_,i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-stone-200 animate-pulse">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {activities.map(act => (
              <div key={act._id} className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-cyan-300 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-100 cursor-pointer">
                <div className="relative h-52 overflow-hidden">
                  {imgUrl(act.image)
                    ? <img src={imgUrl(act.image)} alt={act.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    : <div className="w-full h-full bg-stone-100 flex items-center justify-center text-5xl">🏄</div>
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-cyan-500 text-white text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full shadow" style={{ fontFamily:"'Syne',sans-serif" }}>{act.tag}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-stone-900 font-black text-lg mb-2 group-hover:text-cyan-600 transition-colors" style={{ fontFamily:"'Syne',sans-serif" }}>{act.title}</h3>
                  <div className="flex items-center gap-3 text-stone-400 text-xs mb-4" style={{ fontFamily:"'DM Sans',sans-serif" }}>
                    <span>📍 {act.location}</span>
                    <span className="text-stone-200">·</span>
                    <span>⏱ {act.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-600 font-black text-lg" style={{ fontFamily:"'Syne',sans-serif" }}>LKR {act.price?.toLocaleString()}</span>
                    <a href="#booking" className="text-xs font-black tracking-widest uppercase text-stone-400 hover:text-cyan-600 transition-colors" style={{ fontFamily:"'Syne',sans-serif" }}>Book →</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
