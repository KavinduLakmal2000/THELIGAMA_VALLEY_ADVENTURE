import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../AdminLogin";
import { authApi, removeToken } from "../../api/client";

// ─── Config ───────────────────────────────────────────────────────────────────
const INACTIVITY_MINUTES = 30;           // auto-logout after this many idle minutes
const WARNING_SECONDS    = 60;           // show warning this many seconds before logout
const INACTIVITY_MS  = INACTIVITY_MINUTES * 60 * 1000;
const WARNING_MS     = INACTIVITY_MS - WARNING_SECONDS * 1000;
const EVENTS         = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard",  label: "Dashboard",  icon: "▦"  },
  { id: "bookings",   label: "Bookings",   icon: "📋" },
  { id: "calendar",   label: "Calendar",   icon: "📅" },
  { id: "activities", label: "Activities", icon: "🏄" },
  { id: "schedule",   label: "Schedule",   icon: "⏱" },
  { id: "reviews",    label: "Reviews",    icon: "⭐" },
];

// ─── Change Password Modal ────────────────────────────────────────────────────
function ChangePasswordModal({ onClose }) {
  const [form, setForm]       = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPw, setShowPw]   = useState({ current: false, next: false, confirm: false });

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
    setApiError("");
  };

  const toggleShow = (k) => setShowPw(s => ({ ...s, [k]: !s[k] }));

  const validate = () => {
    const e = {};
    if (!form.current)           e.current = "Current password is required.";
    if (!form.next)              e.next    = "New password is required.";
    else if (form.next.length < 8) e.next  = "New password must be at least 8 characters.";
    if (!form.confirm)           e.confirm = "Please confirm your new password.";
    else if (form.next !== form.confirm) e.confirm = "Passwords do not match.";
    if (form.current && form.next && form.current === form.next)
      e.next = "New password must be different from current password.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true); setApiError("");
    try {
      await authApi.changePassword(form.current, form.next);
      setSuccess(true);
    } catch (err) {
      setApiError(err.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  // Strength meter
  const strength = (() => {
    const p = form.next;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8)  score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();
  const strengthLabel = ["", "Very weak", "Weak", "Fair", "Strong", "Very strong"][strength];
  const strengthColor = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-cyan-500"][strength];

  const inputCls = (field) =>
    `w-full bg-stone-800 border ${errors[field] ? "border-red-500/60" : "border-stone-700"} focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/10 rounded-xl px-4 py-3 pr-11 text-stone-200 text-sm placeholder-stone-600 outline-none transition-all`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-md bg-stone-900 border border-stone-700 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-stone-800">
          <div>
            <h2 className="text-white font-black text-xl" style={{ fontFamily: "'Syne', sans-serif" }}>
              Change Password
            </h2>
            <p className="text-stone-500 text-xs mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Update your admin account password
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors text-lg"
          >✕</button>
        </div>

        <div className="px-7 py-6">
          {success ? (
            /* ── Success state ── */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
              <h3 className="text-white font-black text-xl mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Password Updated!</h3>
              <p className="text-stone-400 text-sm mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Your password has been changed successfully.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-stone-950 font-black text-sm tracking-widest uppercase rounded-xl"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >Done</button>
            </div>
          ) : (
            /* ── Form state ── */
            <div className="space-y-5">
              {/* Current password */}
              <div>
                <label className="text-stone-500 text-xs font-bold tracking-widest uppercase block mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPw.current ? "text" : "password"}
                    className={inputCls("current")}
                    placeholder="••••••••"
                    value={form.current}
                    onChange={e => set("current", e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                    autoComplete="current-password"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                  <button type="button" onClick={() => toggleShow("current")} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-400 transition-colors">
                    {showPw.current ? "🙈" : "👁"}
                  </button>
                </div>
                {errors.current && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><span>⚠</span>{errors.current}</p>}
              </div>

              {/* New password */}
              <div>
                <label className="text-stone-500 text-xs font-bold tracking-widest uppercase block mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPw.next ? "text" : "password"}
                    className={inputCls("next")}
                    placeholder="Min. 8 characters"
                    value={form.next}
                    onChange={e => set("next", e.target.value)}
                    autoComplete="new-password"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                  <button type="button" onClick={() => toggleShow("next")} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-400 transition-colors">
                    {showPw.next ? "🙈" : "👁"}
                  </button>
                </div>
                {/* Strength bar */}
                {form.next && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : "bg-stone-700"}`} />
                      ))}
                    </div>
                    <p className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif",
                      color: ["","#ef4444","#f97316","#eab308","#22c55e","#06b6d4"][strength] }}>
                      {strengthLabel}
                    </p>
                  </div>
                )}
                {errors.next && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><span>⚠</span>{errors.next}</p>}
              </div>

              {/* Confirm password */}
              <div>
                <label className="text-stone-500 text-xs font-bold tracking-widest uppercase block mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPw.confirm ? "text" : "password"}
                    className={inputCls("confirm")}
                    placeholder="Re-enter new password"
                    value={form.confirm}
                    onChange={e => set("confirm", e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                    autoComplete="new-password"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                  <button type="button" onClick={() => toggleShow("confirm")} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-400 transition-colors">
                    {showPw.confirm ? "🙈" : "👁"}
                  </button>
                  {/* Match indicator */}
                  {form.confirm && (
                    <div className={`absolute right-9 top-1/2 -translate-y-1/2 text-sm ${form.next === form.confirm ? "text-green-400" : "text-red-400"}`}>
                      {form.next === form.confirm ? "✓" : "✗"}
                    </div>
                  )}
                </div>
                {errors.confirm && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><span>⚠</span>{errors.confirm}</p>}
              </div>

              {/* API error */}
              {apiError && (
                <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">
                  <span className="text-red-400 flex-shrink-0">⚠️</span>
                  <p className="text-red-400 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{apiError}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 font-bold text-sm rounded-xl transition-colors"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >Cancel</button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 disabled:from-stone-700 disabled:to-stone-700 disabled:cursor-not-allowed text-stone-950 disabled:text-stone-500 font-black text-sm tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-cyan-500/20 disabled:shadow-none"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Updating...
                    </span>
                  ) : "Update →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Inactivity Timeout Warning Banner ───────────────────────────────────────
function TimeoutWarning({ secondsLeft, onStayLoggedIn }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
      <div className="bg-amber-500/10 border border-amber-500/40 backdrop-blur-md rounded-2xl px-5 py-4 shadow-2xl shadow-black/40 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl flex-shrink-0 animate-pulse">
          ⏳
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-amber-300 font-black text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
            Session expiring
          </p>
          <p className="text-amber-400/70 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Auto-logout in <span className="font-bold text-amber-300">{secondsLeft}s</span> due to inactivity
          </p>
        </div>
        <button
          onClick={onStayLoggedIn}
          className="flex-shrink-0 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs tracking-widest uppercase rounded-lg transition-colors"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >Stay</button>
      </div>
    </div>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────
export default function AdminLayout({ children, page, setPage, pendingCount }) {
  const [collapsed,    setCollapsed]    = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [showPwModal,  setShowPwModal]  = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWarning,  setShowWarning]  = useState(false);
  const [secondsLeft,  setSecondsLeft]  = useState(WARNING_SECONDS);

  const navigate      = useNavigate();
  const warningTimer  = useRef(null);
  const logoutTimer   = useRef(null);
  const countdownRef  = useRef(null);
  const userMenuRef   = useRef(null);

  // ── Logout ──────────────────────────────────────────────────────────────────
  const handleLogout = useCallback(() => {
    clearTimeout(warningTimer.current);
    clearTimeout(logoutTimer.current);
    clearInterval(countdownRef.current);
    logout();
    navigate("/admin/login", { replace: true });
  }, [navigate]);

  // ── Reset inactivity timers ──────────────────────────────────────────────────
  const resetTimers = useCallback(() => {
    clearTimeout(warningTimer.current);
    clearTimeout(logoutTimer.current);
    clearInterval(countdownRef.current);
    setShowWarning(false);
    setSecondsLeft(WARNING_SECONDS);

    warningTimer.current = setTimeout(() => {
      setShowWarning(true);
      setSecondsLeft(WARNING_SECONDS);

      // Countdown tick
      countdownRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) { clearInterval(countdownRef.current); return 0; }
          return s - 1;
        });
      }, 1000);

      // Final logout
      logoutTimer.current = setTimeout(() => {
        removeToken();
        navigate("/admin/login", { replace: true });
      }, WARNING_SECONDS * 1000);
    }, WARNING_MS);
  }, [navigate]);

  // ── Attach activity listeners ────────────────────────────────────────────────
  useEffect(() => {
    resetTimers();
    EVENTS.forEach(ev => window.addEventListener(ev, resetTimers, { passive: true }));
    return () => {
      clearTimeout(warningTimer.current);
      clearTimeout(logoutTimer.current);
      clearInterval(countdownRef.current);
      EVENTS.forEach(ev => window.removeEventListener(ev, resetTimers));
    };
  }, [resetTimers]);

  // ── Close user menu on outside click ────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Sidebar content (shared between desktop + mobile) ───────────────────────
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-5 border-b border-stone-800 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center text-lg flex-shrink-0">🌊</div>
        {!collapsed && (
          <div>
            <p className="text-white font-black text-sm leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>KithulGala</p>
            <p className="text-cyan-400 text-xs font-semibold" style={{ fontFamily: "'Syne', sans-serif" }}>Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const isActive = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setPage(item.id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 relative group ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25"
                  : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
              } ${collapsed ? "justify-center" : ""}`}
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}

              {item.id === "bookings" && pendingCount > 0 && (
                <span className={`${collapsed ? "absolute -top-1 -right-1" : "ml-auto"} bg-amber-500 text-stone-950 text-xs font-black rounded-full w-5 h-5 flex items-center justify-center`}>
                  {pendingCount}
                </span>
              )}

              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-stone-800 text-stone-200 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom buttons */}
      <div className="p-3 border-t border-stone-800 space-y-1">
        <a
          href="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-500 hover:text-stone-300 hover:bg-stone-800/60 text-sm font-semibold transition-all ${collapsed ? "justify-center" : ""}`}
          style={{ fontFamily: "'Syne', sans-serif" }}
          title="Public Site"
        >
          <span>🌐</span>
          {!collapsed && <span>Public Site</span>}
        </a>
        <button
          onClick={() => { setShowPwModal(true); setMobileOpen(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-500 hover:text-cyan-400 hover:bg-cyan-500/10 text-sm font-semibold transition-all ${collapsed ? "justify-center" : ""}`}
          style={{ fontFamily: "'Syne', sans-serif" }}
          title="Change Password"
        >
          <span>🔑</span>
          {!collapsed && <span>Change Password</span>}
        </button>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-500 hover:text-red-400 hover:bg-red-500/10 text-sm font-semibold transition-all ${collapsed ? "justify-center" : ""}`}
          style={{ fontFamily: "'Syne', sans-serif" }}
          title="Log Out"
        >
          <span>🚪</span>
          {!collapsed && <span>Log Out</span>}
        </button>
        <button
          onClick={() => setCollapsed(c => !c)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-stone-700 hover:text-stone-500 hover:bg-stone-800/40 text-sm transition-all ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <span className="text-xs">{collapsed ? "»" : "«"}</span>
          {!collapsed && <span className="text-xs" style={{ fontFamily: "'Syne', sans-serif" }}>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-stone-950 overflow-hidden">
      {/* Modals */}
      {showPwModal && <ChangePasswordModal onClose={() => setShowPwModal(false)} />}

      {/* Inactivity warning */}
      {showWarning && (
        <TimeoutWarning
          secondsLeft={secondsLeft}
          onStayLoggedIn={resetTimers}
        />
      )}

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col bg-stone-900 border-r border-stone-800 flex-shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-56"}`}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-50 w-56 bg-stone-900 border-r border-stone-800 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="bg-stone-900/80 backdrop-blur border-b border-stone-800 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-stone-400 hover:text-white" onClick={() => setMobileOpen(true)}>☰</button>
            <div>
              <h1 className="text-white font-black text-lg capitalize" style={{ fontFamily: "'Syne', sans-serif" }}>{page}</h1>
              <p className="text-stone-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {new Date().toLocaleDateString("en-GB", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Pending badge */}
            {pendingCount > 0 && (
              <button
                onClick={() => setPage("bookings")}
                className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-amber-500/20 transition-colors"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                {pendingCount} pending
              </button>
            )}

            {/* Session timer indicator (subtle, always visible) */}
            <div
              className="hidden sm:flex items-center gap-1.5 text-stone-700 text-xs px-2 py-1 rounded-lg"
              title={`Auto-logout after ${INACTIVITY_MINUTES} min of inactivity`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <span>⏱</span>
              <span>{INACTIVITY_MINUTES}m session</span>
            </div>

            {/* Avatar + dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(s => !s)}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-stone-950 font-black text-sm select-none hover:ring-2 hover:ring-cyan-500/40 transition-all"
                title="Account options"
              >
                A
              </button>

              {/* Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                  {/* Info */}
                  <div className="px-4 py-3 border-b border-stone-800">
                    <p className="text-white font-black text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>Admin</p>
                    <p className="text-stone-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Signed in</p>
                  </div>
                  {/* Options */}
                  <div className="p-1.5 space-y-0.5">
                    <button
                      onClick={() => { setShowPwModal(true); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-300 hover:text-cyan-400 hover:bg-cyan-500/10 text-sm font-semibold transition-all text-left"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      <span>🔑</span> Change Password
                    </button>
                    <button
                      onClick={() => { handleLogout(); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-300 hover:text-red-400 hover:bg-red-500/10 text-sm font-semibold transition-all text-left"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      <span>🚪</span> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
