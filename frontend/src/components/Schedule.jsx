import { schedule } from "../data/data";

export default function Schedule() {
  return (
    <section id="schedule" className="bg-white py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.04)_0%,_transparent_60%)]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="inline-block text-cyan-600 text-xs font-bold tracking-[0.35em] uppercase mb-4" style={{ fontFamily:"'Syne',sans-serif" }}>— {schedule.badge} —</span>
          <h2 className="text-stone-900 font-black mb-6" style={{ fontFamily:"'Bebas Neue','Impact',sans-serif", fontSize:"clamp(2.8rem,6vw,5rem)" }}>
            SCHEDULE & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">OPERATING TIMES</span>
          </h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto" style={{ fontFamily:"'DM Sans',sans-serif" }}>{schedule.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-5">
            <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-5 flex items-center gap-4">
              <span className="text-3xl">📅</span>
              <div>
                <p className="text-cyan-700 text-xs tracking-widest uppercase font-semibold mb-0.5" style={{ fontFamily:"'Syne',sans-serif" }}>Operating Days</p>
                <p className="text-stone-900 font-black text-lg" style={{ fontFamily:"'Syne',sans-serif" }}>{schedule.operatingDays}</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-stone-400 text-xs tracking-[0.25em] uppercase font-semibold" style={{ fontFamily:"'Syne',sans-serif" }}>Activity Time Slots</p>
              {schedule.slots.map((slot,i) => (
                <div key={i} className="group flex items-center justify-between bg-stone-50 border border-stone-200 hover:border-cyan-300 rounded-2xl px-6 py-5 transition-all hover:bg-cyan-50/50 hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{slot.icon}</span>
                    <span className="text-stone-900 font-black text-lg group-hover:text-cyan-600 transition-colors" style={{ fontFamily:"'Syne',sans-serif" }}>{slot.label}</span>
                  </div>
                  <span className="text-stone-600 font-semibold text-sm" style={{ fontFamily:"'DM Sans',sans-serif" }}>{slot.time}</span>
                </div>
              ))}
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 flex items-start gap-4">
              <span className="text-3xl">🌿</span>
              <div>
                <p className="text-teal-700 text-xs tracking-widest uppercase font-semibold mb-0.5" style={{ fontFamily:"'Syne',sans-serif" }}>Best Time to Visit</p>
                <p className="text-stone-900 font-black text-lg" style={{ fontFamily:"'Syne',sans-serif" }}>{schedule.bestTime}</p>
                <p className="text-stone-500 text-sm mt-1" style={{ fontFamily:"'DM Sans',sans-serif" }}>{schedule.bestTimeNote}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-50 rounded-full blur-2xl" />
              <h3 className="text-stone-900 font-black text-2xl mb-6" style={{ fontFamily:"'Bebas Neue','Impact',sans-serif", fontSize:"2rem" }}>DAILY SCHEDULE AT A GLANCE</h3>

              <div className="relative pl-8 space-y-0">
                {[
                  { time:"7:30 AM",  event:"Gates Open",             color:"bg-stone-300"  },
                  { time:"8:00 AM",  event:"Morning Session Begins", color:"bg-cyan-500"   },
                  { time:"11:00 AM", event:"Morning Session Ends",   color:"bg-stone-300"  },
                  { time:"11:30 AM", event:"Midday Session Begins",  color:"bg-teal-500"   },
                  { time:"2:30 PM",  event:"Midday Session Ends",    color:"bg-stone-300"  },
                  { time:"3:00 PM",  event:"Afternoon Session",      color:"bg-cyan-400"   },
                  { time:"5:00 PM",  event:"Last Activity",          color:"bg-stone-300"  },
                  { time:"9:00 PM",  event:"Gates Close",            color:"bg-stone-400"  },
                ].map((item,i) => (
                  <div key={i} className="relative flex items-start gap-4 pb-5">
                    <div className="absolute left-0 top-3 bottom-0 w-px bg-stone-200" />
                    <div className={`absolute -left-1.5 top-2 w-3 h-3 rounded-full ${item.color} z-10`} />
                    <div className="pl-6">
                      <span className="text-stone-400 text-xs font-mono">{item.time}</span>
                      <p className="text-stone-700 text-sm font-semibold" style={{ fontFamily:"'DM Sans',sans-serif" }}>{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-amber-700 text-xs leading-relaxed" style={{ fontFamily:"'DM Sans',sans-serif" }}>{schedule.warning}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
