import { footer } from "../data/data";

export default function Footer() {
  return (
    <footer className="bg-stone-900 border-t border-stone-800 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center text-xl">🌊</div>
              <span className="font-black text-xl text-white" style={{ fontFamily:"'Bebas Neue','Impact',sans-serif", letterSpacing:"0.05em" }}>
                KithulGala<span className="text-cyan-400"> Adventures</span>
              </span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed" style={{ fontFamily:"'DM Sans',sans-serif" }}>{footer.about}</p>
          </div>

          <div>
            <h4 className="text-white font-black text-sm tracking-widest uppercase mb-5" style={{ fontFamily:"'Syne',sans-serif" }}>Quick Links</h4>
            <ul className="space-y-2">
              {footer.quickLinks.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-stone-400 hover:text-cyan-400 text-sm transition-colors flex items-center gap-2 group" style={{ fontFamily:"'DM Sans',sans-serif" }}>
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all text-cyan-400">→</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-sm tracking-widest uppercase mb-5" style={{ fontFamily:"'Syne',sans-serif" }}>Get In Touch</h4>
            <div className="space-y-3 text-sm" style={{ fontFamily:"'DM Sans',sans-serif" }}>
              <p className="text-stone-400">📍 Kitulgala, Sri Lanka</p>
              <p className="text-stone-400">📞 +94 XX XXX XXXX</p>
              <p className="text-stone-400">✉️ info@kithulgalaadventures.com</p>
            </div>
            <div className="flex gap-3 mt-6">
              {["📘","📸","▶️","🐦"].map((icon,i) => (
                <button key={i} className="w-10 h-10 rounded-full bg-stone-800 hover:bg-stone-700 border border-stone-700 flex items-center justify-center text-sm transition-all hover:scale-110">{icon}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-stone-500 text-xs" style={{ fontFamily:"'DM Sans',sans-serif" }}>{footer.copyright}</p>
          <div className="flex gap-6">
            {["Privacy Policy","Terms of Service"].map(item => (
              <a key={item} href="#" className="text-stone-600 hover:text-stone-400 text-xs transition-colors" style={{ fontFamily:"'DM Sans',sans-serif" }}>{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
