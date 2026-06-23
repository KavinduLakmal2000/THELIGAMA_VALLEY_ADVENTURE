import { useState, useEffect } from "react";
import { guidelines } from "../data/data";

export default function Guidelines() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  // Auto-sliding logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        setActiveIndex((prev) => (prev + 1) % guidelines.length);
      }
    }, 4000); // Slides every 4 seconds
    return () => clearInterval(interval);
  }, [isDragging]);

  const getPrevIndex = () => (activeIndex - 1 + guidelines.length) % guidelines.length;
  const getNextIndex = () => (activeIndex + 1) % guidelines.length;

  const prevSlide = () => setActiveIndex(getPrevIndex());
  const nextSlide = () => setActiveIndex(getNextIndex());

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX);
    setDragOffset(0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const offset = e.pageX - startX;
    if (Math.abs(offset) > 10) setHasMoved(true);
    setDragOffset(offset);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    if (dragOffset > 100) prevSlide();
    else if (dragOffset < -100) nextSlide();
    setIsDragging(false);
    setDragOffset(0);
  };

  return (
    <section id="guidelines" className="bg-stone-50 py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage:"repeating-linear-gradient(45deg,#06b6d4 0,#06b6d4 1px,transparent 0,transparent 50%)", backgroundSize:"20px 20px" }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="inline-block text-cyan-600 text-xl font-bold tracking-[0.35em] uppercase mb-4" style={{ fontFamily:"'Bebas Neue', 'Impact', sans-serif" }}>— Your Safety First —</span>
          <h2 className="text-stone-900 font-black mb-6" style={{ fontFamily:"'Bebas Neue','Impact',sans-serif", fontSize:"clamp(2.8rem,6vw,5rem)" }}>
            SAFETY & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">GUIDELINES</span>
          </h2>
          <p className="text-stone-500 text-xl max-w-2xl mx-auto" style={{ fontFamily:"'DM Sans',sans-serif" }}>
            Your safety is our top priority. All activities are conducted under strict international safety standards with trained guides and certified equipment.
          </p>
        </div>

        {/* Horizontal 3D Slider with Manual & Mouse Drag Controls */}
        <div 
          className={`relative h-[450px] flex items-center justify-center select-none ${isDragging ? "cursor-grabbing" : ""}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Manual Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 md:left-10 z-40 w-14 h-14 rounded-full bg-white/80 backdrop-blur shadow-xl border border-stone-200 flex items-center justify-center text-stone-400 hover:text-cyan-500 hover:scale-110 transition-all group"
            aria-label="Previous Guideline"
          >
            <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
          </button>

          <button 
            onClick={nextSlide}
            className="absolute right-0 md:right-10 z-40 w-14 h-14 rounded-full bg-white/80 backdrop-blur shadow-xl border border-stone-200 flex items-center justify-center text-stone-400 hover:text-cyan-500 hover:scale-110 transition-all group"
            aria-label="Next Guideline"
          >
            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
          </button>

          <div 
            className="w-full flex items-center justify-center relative"
            style={{ 
              transform: `translateX(${dragOffset}px)`, 
              transition: isDragging ? "none" : "transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1)" 
            }}
          >
            {guidelines.map((item, i) => {
              const isActive = i === activeIndex;
              const isPrev = i === getPrevIndex();
              const isNext = i === getNextIndex();

              // Position logic
              let positionClasses = "opacity-0 scale-50 pointer-events-none";
              if (isActive) positionClasses = "z-30 opacity-100 scale-100 translate-x-0 cursor-default";
              else if (isPrev) positionClasses = "z-20 opacity-40 scale-75 -translate-x-[50%] md:-translate-x-[70%] blur-[2px]";
              else if (isNext) positionClasses = "z-20 opacity-40 scale-75 translate-x-[50%] md:translate-x-[70%] blur-[2px]";

              return (
                <div
                  key={i}
                  onClick={() => !hasMoved && setActiveIndex(i)}
                  className={`absolute transition-all duration-700 ease-in-out w-full max-w-[320px] md:max-w-[400px] ${positionClasses}`}
                >
                  <div 
                    className={`group bg-white border rounded-[2.5rem] p-10 shadow-2xl transition-all duration-500 overflow-hidden relative
                      ${isActive ? "border-stone-200 hover:border-cyan-400 hover:bg-cyan-50/30 shadow-cyan-100/50" : "border-stone-100 shadow-none hover:border-stone-300"}
                      ${isDragging ? "cursor-grabbing" : isActive ? "cursor-default" : "cursor-pointer"}
                    `}
                  >
                    {/* Hover Glow Effect for Active Card */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-teal-500/0 group-hover:from-cyan-500/5 group-hover:to-teal-500/5 transition-all duration-500" />
                    
                    <div className="relative z-10 text-center">
                      <div className="text-6xl mb-6 transition-transform group-hover:scale-110 duration-500">{item.icon}</div>
                      <h3 className="text-stone-900 font-black text-4xl uppercase mb-4" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", letterSpacing: "0.05em" }}>
                        {item.title}
                      </h3>
                      <p className="text-stone-500 text-lg leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
