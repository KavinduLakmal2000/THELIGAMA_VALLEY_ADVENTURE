import { schedule } from "../data/data";

export default function Schedule() {
  return (
    <section id="schedule" className="bg-stone-950 py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.06)_0%,_transparent_60%)]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <span
            className="inline-block text-cyan-400 text-xs font-bold tracking-[0.35em] uppercase mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            — {schedule.badge} —
          </span>
          <h2
            className="text-white font-black mb-6"
            style={{
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
            }}
          >
            SCHEDULE &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
              OPERATING TIMES
            </span>
          </h2>
          <p className="text-stone-400 text-lg max-w-xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {schedule.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left — time slots */}
          <div className="space-y-5">
            {/* Operating days banner */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-5 flex items-center gap-4">
              <span className="text-3xl">📅</span>
              <div>
                <p className="text-stone-400 text-xs tracking-widest uppercase font-semibold mb-0.5" style={{ fontFamily: "'Syne', sans-serif" }}>Operating Days</p>
                <p className="text-white font-black text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>{schedule.operatingDays}</p>
              </div>
            </div>

            {/* Slots */}
            <div className="space-y-4">
              <p className="text-stone-500 text-xs tracking-[0.25em] uppercase font-semibold" style={{ fontFamily: "'Syne', sans-serif" }}>Activity Time Slots</p>
              {schedule.slots.map((slot, i) => (
                <div
                  key={i}
                  className="group flex items-center justify-between bg-stone-900/60 border border-stone-800 hover:border-cyan-500/40 rounded-2xl px-6 py-5 transition-all duration-200 hover:bg-stone-900"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{slot.icon}</span>
                    <span className="text-white font-black text-lg group-hover:text-cyan-400 transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {slot.label}
                    </span>
                  </div>
                  <span className="text-stone-300 font-semibold text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {slot.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Best time */}
            <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-5 flex items-start gap-4">
              <span className="text-3xl">🌿</span>
              <div>
                <p className="text-stone-400 text-xs tracking-widest uppercase font-semibold mb-0.5" style={{ fontFamily: "'Syne', sans-serif" }}>Best Time to Visit</p>
                <p className="text-white font-black text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>{schedule.bestTime}</p>
                <p className="text-stone-400 text-sm mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{schedule.bestTimeNote}</p>
              </div>
            </div>
          </div>

          {/* Right — visual card */}
          <div className="relative">
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 overflow-hidden relative">
              {/* Decorative glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl" />

              <h3
                className="text-white font-black text-2xl mb-6"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", fontSize: "2rem" }}
              >
                DAILY SCHEDULE AT A GLANCE
              </h3>

              {/* Timeline */}
              <div className="relative pl-8 space-y-0">
                {[
                  { time: "7:30 AM", event: "Gates Open", color: "bg-stone-600" },
                  { time: "8:00 AM", event: "Morning Session Begins", color: "bg-cyan-500" },
                  { time: "11:00 AM", event: "Morning Session Ends", color: "bg-stone-600" },
                  { time: "11:30 AM", event: "Midday Session Begins", color: "bg-teal-500" },
                  { time: "2:30 PM", event: "Midday Session Ends", color: "bg-stone-600" },
                  { time: "3:00 PM", event: "Afternoon Session", color: "bg-cyan-400" },
                  { time: "5:00 PM", event: "Last Activity", color: "bg-stone-600" },
                  { time: "9:00 PM", event: "Gates Close", color: "bg-stone-700" },
                ].map((item, i) => (
                  <div key={i} className="relative flex items-start gap-4 pb-5">
                    {/* Line */}
                    <div className="absolute left-0 top-3 bottom-0 w-px bg-stone-800" />
                    {/* Dot */}
                    <div className={`absolute -left-1.5 top-2 w-3 h-3 rounded-full ${item.color} z-10`} />

                    <div className="pl-6">
                      <span className="text-stone-500 text-xs font-mono">{item.time}</span>
                      <p className="text-stone-200 text-sm font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Warning */}
              <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <p className="text-amber-300 text-xs leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {schedule.warning}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
