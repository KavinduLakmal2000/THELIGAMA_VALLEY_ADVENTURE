import { contact } from "../data/data";

export default function Contact() {
  return (
    <section id="contact" className="bg-stone-900 py-28 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-700 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span
            className="inline-block text-cyan-400 text-xs font-bold tracking-[0.35em] uppercase mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            — Get In Touch —
          </span>
          <h2
            className="text-white font-black mb-4"
            style={{
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
            }}
          >
            LET'S PLAN YOUR{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
              ADVENTURE
            </span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Contact cards */}
          {[
            { icon: "📍", label: "Location", value: contact.address, sub: "Kitulgala, Sri Lanka" },
            { icon: "📞", label: "Phone", value: contact.phone, sub: "Call us anytime" },
            { icon: "✉️", label: "Email", value: contact.email, sub: "We reply within 24hrs" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-stone-950/60 border border-stone-800 hover:border-cyan-500/30 rounded-2xl p-8 transition-all duration-200 text-center group"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <p
                className="text-stone-500 text-xs tracking-widest uppercase font-semibold mb-2"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {item.label}
              </p>
              <p
                className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {item.value}
              </p>
              <p className="text-stone-500 text-sm mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {item.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Hours */}
        <div className="mt-8 text-center bg-stone-950/60 border border-stone-800 rounded-2xl p-6">
          <span className="text-3xl">🕐</span>
          <p
            className="text-white font-black text-lg mt-2"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {contact.hours}
          </p>
          <p className="text-stone-500 text-sm mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Open 7 days a week, all year round
          </p>
        </div>
      </div>
    </section>
  );
}
