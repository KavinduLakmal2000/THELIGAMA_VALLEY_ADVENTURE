import { useState, useEffect } from "react";
import { bookingsApi } from "../../api/client";

function StatCard({ label, value, sub, icon, color = "cyan", onClick }) {
  const colors = {
    cyan:   "from-cyan-500/10 to-cyan-500/5   border-cyan-500/20   text-cyan-400",
    amber:  "from-amber-500/10 to-amber-500/5  border-amber-500/20  text-amber-400",
    green:  "from-green-500/10 to-green-500/5  border-green-500/20  text-green-400",
    purple: "from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-400",
  };
  return (
    <button onClick={onClick} className={`w-full text-left bg-gradient-to-br ${colors[color]} border rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-bold tracking-widest uppercase ${colors[color].split(" ").pop()}`} style={{ fontFamily: "'Syne', sans-serif" }}>{label}</span>
      </div>
      <div className="text-white font-black text-3xl mb-1" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>{value}</div>
      <div className="text-stone-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>{sub}</div>
    </button>
  );
}

function RevenueChart({ monthlyRevenue }) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  if (!monthlyRevenue?.length) return <div className="h-40 flex items-center justify-center text-stone-600 text-sm">No revenue data yet</div>;
  const max = Math.max(...monthlyRevenue.map(m => m.revenue), 1);
  return (
    <div className="flex items-end gap-2 h-40 px-1">
      {monthlyRevenue.map(({ _id, revenue }) => {
        const pct = (revenue / max) * 100;
        const [, m] = _id.split("-");
        return (
          <div key={_id} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="relative w-full" style={{ height: "120px" }}>
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-stone-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">LKR {revenue.toLocaleString()}</div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500 to-teal-400 rounded-t-lg opacity-80 group-hover:opacity-100 transition-all" style={{ height: `${pct}%` }} />
            </div>
            <span className="text-stone-500 text-xs">{months[parseInt(m) - 1]}</span>
          </div>
        );
      })}
    </div>
  );
}

function ActivityBreakdown({ activityStats }) {
  if (!activityStats?.length) return <p className="text-stone-600 text-sm">No data yet</p>;
  const total = activityStats.reduce((s, a) => s + a.count, 0) || 1;
  const colors = ["bg-cyan-500","bg-teal-500","bg-sky-500","bg-emerald-500","bg-violet-500","bg-amber-500"];
  return (
    <div className="space-y-3">
      {activityStats.map(({ _id, count }, i) => (
        <div key={_id}>
          <div className="flex justify-between text-xs mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <span className="text-stone-300 truncate max-w-[180px]">{_id}</span>
            <span className="text-stone-500">{count} ({Math.round(count/total*100)}%)</span>
          </div>
          <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
            <div className={`h-full ${colors[i % colors.length]} rounded-full`} style={{ width: `${(count/total)*100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

const STATUS_COLOR = {
  confirmed: "bg-green-500/15 text-green-400 border-green-500/25",
  pending:   "bg-amber-500/15 text-amber-400 border-amber-500/25",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/25",
  completed: "bg-stone-600/40 text-stone-400 border-stone-600/40",
};

export default function Dashboard({ setPage }) {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    bookingsApi.getStats()
      .then(res => setStats(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <svg className="animate-spin w-8 h-8 text-cyan-500" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>
  );

  if (error) return (
    <div className="bg-red-500/10 border border-red-500/25 rounded-2xl p-6 text-red-400 text-sm">{error}</div>
  );

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📋" label="Total Bookings"  value={stats.total}          sub="All time"            color="cyan"   onClick={() => setPage("bookings")} />
        <StatCard icon="⏳" label="Pending"         value={stats.pending}        sub="Needs confirmation"  color="amber"  onClick={() => setPage("bookings")} />
        <StatCard icon="✅" label="Confirmed"        value={stats.confirmed}      sub="Ready to go"         color="green"  onClick={() => setPage("bookings")} />
        <StatCard icon="💰" label="Total Revenue"   value={`LKR ${Math.round((stats.totalRevenue||0)/1000)}K`} sub="Excl. cancelled" color="purple" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-black text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>Revenue Overview</h2>
              <p className="text-stone-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Last 6 months · LKR</p>
            </div>
            <span className="text-cyan-400 font-black text-xl" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>LKR {(stats.totalRevenue||0).toLocaleString()}</span>
          </div>
          <RevenueChart monthlyRevenue={stats.monthlyRevenue} />
        </div>
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
          <h2 className="text-white font-black text-lg mb-5" style={{ fontFamily: "'Syne', sans-serif" }}>Popular Activities</h2>
          <ActivityBreakdown activityStats={stats.activityStats} />
        </div>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-black text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>Upcoming Bookings</h2>
          <button onClick={() => setPage("bookings")} className="text-cyan-400 text-xs font-bold tracking-widest uppercase hover:text-cyan-300" style={{ fontFamily: "'Syne', sans-serif" }}>View All →</button>
        </div>
        {!stats.upcoming?.length ? (
          <p className="text-stone-600 text-sm">No upcoming bookings</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-800">
                  {["Guest","Activity","Date","Slot","Guests","Status"].map(h => (
                    <th key={h} className="text-left text-stone-500 text-xs font-bold tracking-widest uppercase pb-3 pr-4" style={{ fontFamily: "'Syne', sans-serif" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {stats.upcoming.map(b => (
                  <tr key={b._id} className="hover:bg-stone-800/30">
                    <td className="py-3 pr-4 text-stone-200 font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{b.name}</td>
                    <td className="py-3 pr-4 text-stone-400">{b.activity}</td>
                    <td className="py-3 pr-4 text-stone-300">{b.date}</td>
                    <td className="py-3 pr-4 text-stone-400">{b.slot}</td>
                    <td className="py-3 pr-4 text-stone-400">{b.guests}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLOR[b.status]}`} style={{ fontFamily: "'Syne', sans-serif" }}>{b.status}</span>
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
