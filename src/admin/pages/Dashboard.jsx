import { useState, useEffect } from "react";
import { getDashboardStats, getBookings } from "../store/mockData";

function StatCard({ label, value, sub, icon, color = "cyan", onClick }) {
  const colors = {
    cyan:   "from-cyan-500/10 to-cyan-500/5   border-cyan-500/20   text-cyan-400",
    amber:  "from-amber-500/10 to-amber-500/5  border-amber-500/20  text-amber-400",
    green:  "from-green-500/10 to-green-500/5  border-green-500/20  text-green-400",
    purple: "from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-400",
  };
  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-gradient-to-br ${colors[color]} border rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-bold tracking-widest uppercase ${colors[color].split(" ").pop()}`} style={{ fontFamily: "'Syne', sans-serif" }}>
          {label}
        </span>
      </div>
      <div className="text-white font-black text-3xl mb-1" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>
        {value}
      </div>
      <div className="text-stone-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>{sub}</div>
    </button>
  );
}

// Minimal bar chart — pure CSS/SVG, no deps
function RevenueChart({ monthRevenue }) {
  const entries = Object.entries(monthRevenue).sort(([a], [b]) => a.localeCompare(b)).slice(-6);
  const max = Math.max(...entries.map(([, v]) => v), 1);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  if (entries.length === 0) return (
    <div className="h-40 flex items-center justify-center text-stone-600 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      No revenue data yet
    </div>
  );

  return (
    <div className="flex items-end gap-2 h-40 px-1">
      {entries.map(([month, val]) => {
        const pct = (val / max) * 100;
        const [, m] = month.split("-");
        return (
          <div key={month} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="relative w-full" style={{ height: "120px" }}>
              {/* Tooltip */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-stone-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                LKR {val.toLocaleString()}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500 to-teal-400 rounded-t-lg transition-all duration-500 opacity-80 group-hover:opacity-100"
                style={{ height: `${pct}%` }} />
            </div>
            <span className="text-stone-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {months[parseInt(m) - 1]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Activity donut-style breakdown
function ActivityBreakdown({ activityCount }) {
  const entries = Object.entries(activityCount).sort(([, a], [, b]) => b - a).slice(0, 6);
  const total = entries.reduce((s, [, v]) => s + v, 0);
  const colors = ["bg-cyan-500","bg-teal-500","bg-sky-500","bg-emerald-500","bg-violet-500","bg-amber-500"];

  return (
    <div className="space-y-3">
      {entries.map(([name, count], i) => (
        <div key={name}>
          <div className="flex justify-between text-xs mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <span className="text-stone-300 truncate max-w-[180px]">{name}</span>
            <span className="text-stone-500">{count} ({Math.round(count/total*100)}%)</span>
          </div>
          <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${colors[i]} rounded-full transition-all duration-700`}
              style={{ width: `${(count / total) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard({ setPage }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setStats(getDashboardStats());
  }, []);

  if (!stats) return <div className="text-stone-500 text-sm p-8">Loading...</div>;

  const statusColor = {
    confirmed: "bg-green-500/15 text-green-400 border-green-500/25",
    pending:   "bg-amber-500/15 text-amber-400 border-amber-500/25",
    cancelled: "bg-red-500/15 text-red-400 border-red-500/25",
    completed: "bg-stone-600/40 text-stone-400 border-stone-600/40",
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📋" label="Total Bookings"  value={stats.total}          sub="All time"            color="cyan"   onClick={() => setPage("bookings")} />
        <StatCard icon="⏳" label="Pending"         value={stats.pendingCount}   sub="Needs confirmation"  color="amber"  onClick={() => setPage("bookings")} />
        <StatCard icon="✅" label="Confirmed"        value={stats.confirmedCount} sub="Ready to go"         color="green"  onClick={() => setPage("bookings")} />
        <StatCard icon="💰" label="Total Revenue"   value={`LKR ${(stats.totalRevenue/1000).toFixed(0)}K`} sub="Excl. cancelled" color="purple" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-black text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>Revenue Overview</h2>
              <p className="text-stone-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Last 6 months · LKR</p>
            </div>
            <span className="text-cyan-400 font-black text-xl" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>
              LKR {stats.totalRevenue.toLocaleString()}
            </span>
          </div>
          <RevenueChart monthRevenue={stats.monthRevenue} />
        </div>

        {/* Activity breakdown */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
          <h2 className="text-white font-black text-lg mb-5" style={{ fontFamily: "'Syne', sans-serif" }}>Popular Activities</h2>
          <ActivityBreakdown activityCount={stats.activityCount} />
        </div>
      </div>

      {/* Upcoming bookings */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-black text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>Upcoming Bookings</h2>
          <button
            onClick={() => setPage("bookings")}
            className="text-cyan-400 text-xs font-bold tracking-widest uppercase hover:text-cyan-300 transition-colors"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            View All →
          </button>
        </div>

        {stats.upcoming.length === 0 ? (
          <p className="text-stone-600 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>No upcoming bookings</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-800">
                  {["ID","Guest","Activity","Date","Slot","Guests","Status"].map(h => (
                    <th key={h} className="text-left text-stone-500 text-xs font-bold tracking-widest uppercase pb-3 pr-4" style={{ fontFamily: "'Syne', sans-serif" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {stats.upcoming.map(b => (
                  <tr key={b.id} className="hover:bg-stone-800/30 transition-colors">
                    <td className="py-3 pr-4 text-stone-500 font-mono text-xs">{b.id}</td>
                    <td className="py-3 pr-4 text-stone-200 font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{b.name}</td>
                    <td className="py-3 pr-4 text-stone-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{b.activity}</td>
                    <td className="py-3 pr-4 text-stone-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>{b.date}</td>
                    <td className="py-3 pr-4 text-stone-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{b.slot}</td>
                    <td className="py-3 pr-4 text-stone-400">{b.guests}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusColor[b.status]}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
