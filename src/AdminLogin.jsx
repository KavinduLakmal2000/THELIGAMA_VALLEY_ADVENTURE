import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

// ─── CREDENTIALS ──────────────────────────────────────────────────────────────
// Change these before going live. When you add a real backend,
// replace the handleLogin body with an API call and store a JWT.
const CREDENTIALS = {
  username: "admin",
  password: "kithulgala2025",
};

export const AUTH_KEY = "kithulgala_admin_auth";
export const isAuthenticated = () => !!localStorage.getItem(AUTH_KEY);
export const logout = () => localStorage.removeItem(AUTH_KEY);

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm]       = useState({ username: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  // Already logged in → skip straight to admin
  if (isAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setError("");
  };

  const handleLogin = () => {
    if (!form.username || !form.password) return;
    setLoading(true);
    setError("");

    // Simulated network delay — swap this block for a real API call later
    setTimeout(() => {
      if (
        form.username.trim() === CREDENTIALS.username &&
        form.password === CREDENTIALS.password
      ) {
        localStorage.setItem(AUTH_KEY, "authenticated");
        navigate("/admin", { replace: true });
      } else {
        setError("Incorrect username or password.");
        setLoading(false);
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle dot-grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #06b6d4 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">

        {/* Logo block */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center text-3xl mx-auto mb-5 shadow-2xl shadow-cyan-500/25 ring-1 ring-cyan-400/20">
            🌊
          </div>
          <h1
            className="text-white font-black text-4xl tracking-tight leading-none"
            style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", letterSpacing: "0.06em" }}
          >
            KITHULGALA
          </h1>
          <p
            className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase mt-1"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Admin Panel
          </p>
        </div>

        {/* Login card */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-2xl shadow-black/50">

          <div className="mb-6">
            <h2
              className="text-white font-black text-xl mb-1"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Welcome back
            </h2>
            <p
              className="text-stone-500 text-sm"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Sign in to manage bookings and activities.
            </p>
          </div>

          <div className="space-y-4">

            {/* Username */}
            <div>
              <label
                className="text-stone-500 text-xs font-bold tracking-[0.2em] uppercase block mb-2"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Username
              </label>
              <input
                className="w-full bg-stone-800 border border-stone-700 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 rounded-xl px-4 py-3 text-stone-200 text-sm placeholder-stone-600 outline-none transition-all duration-200"
                placeholder="admin"
                value={form.username}
                onChange={e => set("username", e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                autoComplete="username"
                autoFocus
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="text-stone-500 text-xs font-bold tracking-[0.2em] uppercase block mb-2"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full bg-stone-800 border border-stone-700 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 rounded-xl px-4 py-3 pr-12 text-stone-200 text-sm placeholder-stone-600 outline-none transition-all duration-200"
                  placeholder="••••••••••"
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={e => set("password", e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  autoComplete="current-password"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-400 transition-colors select-none"
                  tabIndex={-1}
                >
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">
                <span className="text-red-400 flex-shrink-0">⚠️</span>
                <p
                  className="text-red-400 text-sm"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {error}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleLogin}
              disabled={loading || !form.username || !form.password}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 disabled:from-stone-700 disabled:to-stone-700 disabled:cursor-not-allowed text-stone-950 disabled:text-stone-500 font-black text-sm tracking-[0.15em] uppercase rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-[1.02] active:scale-[0.99] disabled:shadow-none disabled:hover:scale-100"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In →"
              )}
            </button>

          </div>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-stone-600 hover:text-stone-400 text-xs transition-colors inline-flex items-center gap-1.5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            ← Back to public site
          </a>
        </div>

      </div>
    </div>
  );
}
