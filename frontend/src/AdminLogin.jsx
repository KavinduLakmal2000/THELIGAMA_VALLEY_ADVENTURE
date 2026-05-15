import { useState, useEffect, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { authApi, setToken, getToken, removeToken } from "./api/client";

// ─── Auth helpers (used by ProtectedRoute + AdminLayout) ─────────────────────
export const isAuthenticated = () => !!getToken();
export const logout          = () => removeToken();

// ─── Lockout config ───────────────────────────────────────────────────────────
const MAX_ATTEMPTS     = 3;   // wrong attempts before lockout
const LOCKOUT_SECONDS  = 30;  // initial lockout duration (doubles each extra failure)
const STORAGE_KEY      = "admin_lockout";

// Persist lockout state in sessionStorage so a refresh doesn't bypass it
function loadLockout() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { attempts: 0, lockedUntil: 0 };
  } catch { return { attempts: 0, lockedUntil: 0 }; }
}
function saveLockout(state) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}
function clearLockout() {
  try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
}

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form,      setForm]      = useState({ username: "", password: "" });
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [showPw,    setShowPw]    = useState(false);

  // Lockout state
  const [attempts,    setAttempts]    = useState(() => loadLockout().attempts);
  const [lockedUntil, setLockedUntil] = useState(() => loadLockout().lockedUntil);
  const [countdown,   setCountdown]   = useState(0);
  const timerRef = useRef(null);

  // Already logged in
  if (isAuthenticated()) return <Navigate to="/admin" replace />;

  // ── Countdown tick ──────────────────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      const secs = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
      setCountdown(secs);
      if (secs <= 0) clearInterval(timerRef.current);
    };
    if (lockedUntil > Date.now()) {
      tick();
      timerRef.current = setInterval(tick, 500);
    } else {
      setCountdown(0);
    }
    return () => clearInterval(timerRef.current);
  }, [lockedUntil]);

  const isLocked = () => Date.now() < lockedUntil;

  const recordFailure = (currentAttempts) => {
    const newAttempts = currentAttempts + 1;
    let until = lockedUntil;

    if (newAttempts >= MAX_ATTEMPTS) {
      // Exponential back-off: 30s, 60s, 120s, 240s…
      const factor      = Math.pow(2, newAttempts - MAX_ATTEMPTS);
      const secs        = LOCKOUT_SECONDS * factor;
      until             = Date.now() + secs * 1000;
      setLockedUntil(until);
    }

    setAttempts(newAttempts);
    saveLockout({ attempts: newAttempts, lockedUntil: until });
    return newAttempts;
  };

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setError("");
  };

  const handleLogin = async () => {
    if (isLocked() || loading || !form.username || !form.password) return;
    setLoading(true);
    setError("");
    try {
      const data = await authApi.login(form.username.trim(), form.password);
      setToken(data.token);
      clearLockout();
      navigate("/admin", { replace: true });
    } catch (err) {
      const newAttempts = recordFailure(attempts);
      const remaining   = MAX_ATTEMPTS - newAttempts;

      if (newAttempts >= MAX_ATTEMPTS) {
        const factor = Math.pow(2, newAttempts - MAX_ATTEMPTS);
        const secs   = LOCKOUT_SECONDS * factor;
        setError(`Too many failed attempts. Locked for ${secs} seconds.`);
      } else {
        setError(
          `Incorrect username or password. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`
        );
      }
      setLoading(false);
    }
  };

  // ── Progress bar for lockout ────────────────────────────────────────────────
  const totalLockSecs = (() => {
    const factor = Math.pow(2, Math.max(0, attempts - MAX_ATTEMPTS));
    return LOCKOUT_SECONDS * factor;
  })();
  const progressPct = isLocked() ? (countdown / totalLockSecs) * 100 : 0;

  // ── Attempt dots ────────────────────────────────────────────────────────────
  const dots = Array.from({ length: MAX_ATTEMPTS }, (_, i) => i < attempts);

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage:"radial-gradient(circle,#06b6d4 1px,transparent 1px)", backgroundSize:"28px 28px" }} />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center text-3xl mx-auto mb-5 shadow-2xl shadow-cyan-500/25 ring-1 ring-cyan-400/20">🌊</div>
          <h1 className="text-white font-black text-4xl leading-none" style={{ fontFamily:"'Bebas Neue','Impact',sans-serif", letterSpacing:"0.06em" }}>KITHULGALA</h1>
          <p className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase mt-1" style={{ fontFamily:"'Syne',sans-serif" }}>Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">

          {/* Lockout progress bar */}
          {isLocked() && (
            <div className="h-1 bg-stone-800">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          )}

          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-white font-black text-xl mb-1" style={{ fontFamily:"'Syne',sans-serif" }}>Welcome back</h2>
              <p className="text-stone-500 text-sm" style={{ fontFamily:"'DM Sans',sans-serif" }}>Sign in to manage bookings and activities.</p>
            </div>

            <div className="space-y-4">
              {/* Username */}
              <div>
                <label className="text-stone-500 text-xs font-bold tracking-[0.2em] uppercase block mb-2" style={{ fontFamily:"'Syne',sans-serif" }}>Username</label>
                <input
                  className={`w-full bg-stone-800 border ${isLocked() ? "border-stone-700 opacity-50 cursor-not-allowed" : "border-stone-700 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10"} rounded-xl px-4 py-3 text-stone-200 text-sm placeholder-stone-600 outline-none transition-all`}
                  placeholder="admin"
                  value={form.username}
                  onChange={e => set("username", e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  disabled={isLocked()}
                  autoComplete="username"
                  autoFocus
                  style={{ fontFamily:"'DM Sans',sans-serif" }}
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-stone-500 text-xs font-bold tracking-[0.2em] uppercase block mb-2" style={{ fontFamily:"'Syne',sans-serif" }}>Password</label>
                <div className="relative">
                  <input
                    className={`w-full bg-stone-800 border ${isLocked() ? "border-stone-700 opacity-50 cursor-not-allowed" : "border-stone-700 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10"} rounded-xl px-4 py-3 pr-12 text-stone-200 text-sm placeholder-stone-600 outline-none transition-all`}
                    placeholder="••••••••••"
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={e => set("password", e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    disabled={isLocked()}
                    autoComplete="current-password"
                    style={{ fontFamily:"'DM Sans',sans-serif" }}
                  />
                  <button type="button" onClick={() => setShowPw(s => !s)} tabIndex={-1} disabled={isLocked()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-400 transition-colors disabled:cursor-not-allowed">
                    {showPw ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {/* Attempt dots */}
              {attempts > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-stone-600 text-xs" style={{ fontFamily:"'DM Sans',sans-serif" }}>Attempts:</span>
                  <div className="flex gap-1.5">
                    {dots.map((used, i) => (
                      <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${used ? (i >= MAX_ATTEMPTS - 1 ? "bg-red-500 shadow-sm shadow-red-500/50" : "bg-amber-500") : "bg-stone-700"}`} />
                    ))}
                  </div>
                  {!isLocked() && attempts < MAX_ATTEMPTS && (
                    <span className="text-stone-600 text-xs ml-1" style={{ fontFamily:"'DM Sans',sans-serif" }}>
                      {MAX_ATTEMPTS - attempts} left
                    </span>
                  )}
                </div>
              )}

              {/* Error / lockout message */}
              {(error || isLocked()) && (
                <div className={`flex items-start gap-2.5 rounded-xl px-4 py-3 ${
                  isLocked()
                    ? "bg-red-500/10 border border-red-500/30"
                    : "bg-amber-500/10 border border-amber-500/25"
                }`}>
                  <span className="flex-shrink-0 mt-0.5">{isLocked() ? "🔒" : "⚠️"}</span>
                  <div style={{ fontFamily:"'DM Sans',sans-serif" }}>
                    {isLocked() ? (
                      <>
                        <p className="text-red-400 text-sm font-bold">Account temporarily locked</p>
                        <p className="text-red-400/70 text-xs mt-0.5">
                          Try again in <span className="font-black text-red-300">{countdown}s</span>
                          {countdown > 60 ? ` (${Math.ceil(countdown/60)} min)` : ""}
                        </p>
                      </>
                    ) : (
                      <p className="text-amber-400 text-sm">{error}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleLogin}
                disabled={loading || isLocked() || !form.username || !form.password}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 disabled:from-stone-700 disabled:to-stone-700 disabled:cursor-not-allowed text-stone-950 disabled:text-stone-500 font-black text-sm tracking-[0.15em] uppercase rounded-xl transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-[1.02] active:scale-[0.99] disabled:shadow-none disabled:hover:scale-100"
                style={{ fontFamily:"'Syne',sans-serif" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in...
                  </span>
                ) : isLocked() ? (
                  <span className="flex items-center justify-center gap-2">
                    🔒 Locked · {countdown}s
                  </span>
                ) : "Sign In →"}
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-stone-600 hover:text-stone-400 text-xs transition-colors inline-flex items-center gap-1.5" style={{ fontFamily:"'DM Sans',sans-serif" }}>
            ← Back to public site
          </a>
        </div>
      </div>
    </div>
  );
}
