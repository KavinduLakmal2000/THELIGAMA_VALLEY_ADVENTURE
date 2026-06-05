import { useRef, useEffect, useState } from "react";
import { about } from "../data/data";

export default function About() {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedFeat, setSelectedFeat] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        if (scrollLeft >= maxScroll - 5) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: 480, behavior: "smooth" });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const scroll = (direction) => {
    const amount = direction === "left" ? -480 : 480;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section id="about" className="bg-white py-28 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-60" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="inline-block text-cyan-600 text-xs font-bold tracking-[0.35em] uppercase mb-4" style={{ fontFamily:"'Syne',sans-serif" }}>— {about.badge} —</span>
          <h2 className="text-stone-900 font-black leading-none mb-6" style={{ fontFamily:"'Bebas Neue','Impact',sans-serif", fontSize:"clamp(2.8rem,6vw,5rem)" }}>
            KITHULGALA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">RIVER</span> ADVENTURES
          </h2>
          <p className="text-stone-500 text-xl max-w-2xl mx-auto leading-relaxed" style={{ fontFamily:"'DM Sans',sans-serif" }}>{about.description}</p>
        </div>

        <div className="relative group/container">
          {/* Navigation Arrows */}
          <button 
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-20 z-20 w-12 h-12 rounded-full bg-white shadow-xl border border-stone-100 flex items-center justify-center text-stone-400 hover:text-cyan-500 transition-all"
          >
            ←
          </button>
          
          <button 
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-20 z-20 w-12 h-12 rounded-full bg-white shadow-xl border border-stone-100 flex items-center justify-center text-stone-400 hover:text-cyan-500 transition-all"
          >
            →
          </button>

          {/* Scrolling Container */}
          <div 
            ref={scrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex gap-10 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pt-6 pb-8 px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {about.features.map((feat, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedFeat(feat)}
                className="flex-shrink-0 w-[320px] md:w-[450px] snap-center group relative bg-white border border-stone-200 hover:border-cyan-300 rounded-[2rem] p-10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-100/50 overflow-hidden cursor-pointer"
              >
            <div 
            className="absolute inset-0 opacity-[0.3] pointer-events-none transition-opacity duration-500 group-hover:opacity-[0.06]"
            style={{ 
              backgroundImage: `url(${feat.image})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              maskImage: 'radial-gradient(circle, black 35%, transparent 90%)',
              WebkitMaskImage: 'radial-gradient(circle, black 35%, transparent 90%)'
            }}
            />
                <div className="absolute top-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-teal-400 group-hover:w-full transition-all duration-500" />
            
            <div className="relative z-10">
              <div className="text-5xl mb-6">{feat.icon}</div>
              <h3 className="text-stone-900 font-black text-3xl uppercase mb-4" style={{ fontFamily:"'Bebas Neue', 'Impact', sans-serif", letterSpacing: "0.05em" }}>{feat.title}</h3>
              <p className="text-stone-500 text-xl leading-relaxed" style={{ fontFamily:"'DM Sans',sans-serif" }}>{feat.text}</p>
            </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[{ value:"10+", label:"Activities" },{ value:"5000+", label:"Happy Adventurers" },{ value:"100%", label:"Safety Record" },{ value:"365", label:"Days Open" }].map((stat,i) => (
            <div key={i} className="text-center p-6 bg-stone-50 rounded-2xl border border-stone-100">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500 mb-1" style={{ fontFamily:"'Bebas Neue','Impact',sans-serif", fontSize:"3rem" }}>{stat.value}</div>
              <div className="text-stone-500 text-xs tracking-widest uppercase font-semibold" style={{ fontFamily:"'Syne',sans-serif" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Modal */}
      {selectedFeat && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedFeat(null)}
        >
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300" />
          
          <div 
            className="relative bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedFeat(null)}
              className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-stone-800 hover:bg-white transition-colors shadow-lg"
            >
              ✕
            </button>

            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-1/2 h-64 md:h-auto">
                <img src={selectedFeat.image} alt={selectedFeat.title} className="w-full h-full object-cover" />
              </div>
              <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                <div className="text-4xl mb-4">{selectedFeat.icon}</div>
                <h3 className="text-stone-900 font-black text-4xl uppercase mb-4" style={{ fontFamily:"'Bebas Neue', 'Impact', sans-serif", letterSpacing: "0.05em" }}>{selectedFeat.title}</h3>
                <div className="w-12 h-1 bg-cyan-500 rounded-full mb-6" />
                <p className="text-stone-500 text-xl leading-relaxed" style={{ fontFamily:"'DM Sans',sans-serif" }}>
                  {selectedFeat.longText}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
