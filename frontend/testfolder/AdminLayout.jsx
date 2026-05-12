import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../AdminLogin";

const NAV = [
  { id: "dashboard",  label: "Dashboard",    icon: "▦" },
  { id: "bookings",   label: "Bookings",     icon: "📋" },
  { id: "calendar",   label: "Calendar",     icon: "📅" },
  { id: "activities", label: "Activities",   icon: "🏄" },
  { id: "schedule",   label: "Schedule",     icon: "⏱" },
  { id: "reviews",    label: "Reviews",      icon: "⭐" },
];

export default function AdminLayout({ children, page, setPage, pendingCount }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-5 border-b border-stone-800 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center text-lg flex-shrink-0">
          🌊
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-black text-sm leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              KithulGala
            </p>
            <p className="text-cyan-400 text-xs font-semibold" style={{ fontFamily: "'Syne', sans-serif" }}>
              Admin Panel
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
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

              {/* Pending badge on bookings */}
              {item.id === "bookings" && pendingCount > 0 && (
                <span className={`${collapsed ? "absolute -top-1 -right-1" : "ml-auto"} bg-amber-500 text-stone-950 text-xs font-black rounded-full w-5 h-5 flex items-center justify-center`}>
                  {pendingCount}
                </span>
              )}

              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-stone-800 text-stone-200 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom — back to site, logout, collapse */}
      <div className="p-3 border-t border-stone-800 space-y-1">
        <a
          href="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-500 hover:text-stone-300 hover:bg-stone-800/60 text-sm font-semibold transition-all ${collapsed ? "justify-center" : ""}`}
          style={{ fontFamily: "'Syne', sans-serif" }}
          title="Back to Site"
        >
          <span>🌐</span>
          {!collapsed && <span>Public Site</span>}
        </a>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-500 hover:text-red-400 hover:bg-red-500/10 text-sm font-semibold transition-all ${collapsed ? "justify-center" : ""}`}
          style={{ fontFamily: "'Syne', sans-serif" }}
          title="Log out"
        >
          <span>🚪</span>
          {!collapsed && <span>Log Out</span>}
        </button>
        <button
          onClick={() => setCollapsed(c => !c)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-stone-700 hover:text-stone-500 hover:bg-stone-800/40 text-sm transition-all ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="text-xs">{collapsed ? "»" : "«"}</span>
          {!collapsed && <span className="text-xs" style={{ fontFamily: "'Syne', sans-serif" }}>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-stone-950 overflow-hidden">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-stone-900 border-r border-stone-800 flex-shrink-0 transition-all duration-300 ${
          collapsed ? "w-16" : "w-56"
        }`}
      >
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
            <button
              className="lg:hidden text-stone-400 hover:text-white"
              onClick={() => setMobileOpen(true)}
            >
              ☰
            </button>
            <div>
              <h1
                className="text-white font-black text-lg capitalize"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {page}
              </h1>
              <p className="text-stone-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
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
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-stone-500 hover:text-red-400 border border-stone-800 hover:border-red-500/30 hover:bg-red-500/5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hidden sm:flex"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              <span>🚪</span> Log out
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-stone-950 font-black text-sm select-none">
              A
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
