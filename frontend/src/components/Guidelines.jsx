import { guidelines } from "../data/data";

export default function Guidelines() {
  return (
    <section id="guidelines" className="bg-stone-50 py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage:"repeating-linear-gradient(45deg,#06b6d4 0,#06b6d4 1px,transparent 0,transparent 50%)", backgroundSize:"20px 20px" }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="inline-block text-cyan-600 text-xs font-bold tracking-[0.35em] uppercase mb-4" style={{ fontFamily:"'Syne',sans-serif" }}>— Your Safety First —</span>
          <h2 className="text-stone-900 font-black mb-6" style={{ fontFamily:"'Bebas Neue','Impact',sans-serif", fontSize:"clamp(2.8rem,6vw,5rem)" }}>
            SAFETY & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">GUIDELINES</span>
          </h2>
          <p className="text-stone-500 text-xl max-w-2xl mx-auto" style={{ fontFamily:"'DM Sans',sans-serif" }}>
            Your safety is our top priority. All activities are conducted under strict international safety standards with trained guides and certified equipment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guidelines.map((item,i) => (
            <div key={i} className="group bg-white border border-stone-200 hover:border-cyan-300 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/0 to-cyan-50/0 group-hover:from-cyan-50 group-hover:to-transparent transition-all duration-500 rounded-2xl" />
              <div className="text-5xl mb-5 relative z-10">{item.icon}</div>
              <h3 className="text-stone-900 font-black text-3xl uppercase mb-3 relative z-10" style={{ fontFamily:"'Bebas Neue', 'Impact', sans-serif", letterSpacing: "0.05em" }}>{item.title}</h3>
              <p className="text-stone-500 text-lg leading-relaxed relative z-10" style={{ fontFamily:"'DM Sans',sans-serif" }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
