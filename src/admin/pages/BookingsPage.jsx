import { useState, useEffect, useCallback } from "react";
import { bookingsApi } from "../../api/client";

const STATUS_COLOR = {
  confirmed: "bg-green-500/15 text-green-400 border-green-500/25",
  pending:   "bg-amber-500/15 text-amber-400 border-amber-500/25",
  cancelled: "bg-red-500/15  text-red-400  border-red-500/25",
  completed: "bg-stone-600/40 text-stone-400 border-stone-600/40",
};

function BookingRow({ b, onStatus, onDelete, delConfirm, setDelConfirm }) {
  const [expanded, setExpanded] = useState(false);
  const id = b._id;

  return (
    <>
      <tr className="border-b border-stone-800/60 hover:bg-stone-800/20 transition-colors cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <td className="py-3 px-4 text-stone-500 font-mono text-xs whitespace-nowrap">{id.slice(-6).toUpperCase()}</td>
        <td className="py-3 px-4">
          <div className="text-stone-200 font-semibold text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{b.name}</div>
          <div className="text-stone-500 text-xs">{b.email}</div>
        </td>
        <td className="py-3 px-4 text-stone-400 text-sm hidden md:table-cell">{b.activity}</td>
        <td className="py-3 px-4 text-stone-300 text-sm whitespace-nowrap hidden sm:table-cell">{b.date}</td>
        <td className="py-3 px-4 text-stone-400 text-sm hidden lg:table-cell">{b.slot}</td>
        <td className="py-3 px-4 text-stone-400 text-sm hidden lg:table-cell">{b.guests}</td>
        <td className="py-3 px-4 text-cyan-400 font-bold text-sm whitespace-nowrap hidden xl:table-cell" style={{ fontFamily: "'Syne', sans-serif" }}>LKR {b.total?.toLocaleString()}</td>
        <td className="py-3 px-4"><span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLOR[b.status]}`} style={{ fontFamily: "'Syne', sans-serif" }}>{b.status}</span></td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            {b.status === "pending"   && <button onClick={() => onStatus(id,"confirmed")} className="px-2 py-1 bg-green-500/10 border border-green-500/25 text-green-400 rounded-lg text-xs font-bold hover:bg-green-500/20">✓</button>}
            {b.status === "confirmed" && <button onClick={() => onStatus(id,"completed")} className="px-2 py-1 bg-stone-600/30 border border-stone-600/40 text-stone-400 rounded-lg text-xs font-bold hover:bg-stone-600/50">Done</button>}
            {(b.status==="pending"||b.status==="confirmed") && <button onClick={() => onStatus(id,"cancelled")} className="px-2 py-1 bg-red-500/10 border border-red-500/25 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/20">✗</button>}
            <button onClick={() => { if(delConfirm===id){onDelete(id);setDelConfirm(null);}else{setDelConfirm(id);setTimeout(()=>setDelConfirm(null),3000);} }} className={`px-2 py-1 text-xs rounded-lg border font-bold transition-colors ${delConfirm===id?"bg-red-500/30 border-red-500/50 text-red-300":"text-stone-700 hover:text-red-400 bg-transparent border-transparent"}`}>{delConfirm===id?"⚠️":"🗑"}</button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-stone-800/20 border-b border-stone-800/40">
          <td colSpan={9} className="px-4 py-4">
            <div className="grid sm:grid-cols-3 gap-4 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <div>
                <p className="text-stone-600 text-xs uppercase tracking-widest font-bold mb-1">Contact</p>
                <p className="text-stone-300">{b.phone}</p><p className="text-stone-400">{b.email}</p>
              </div>
              <div>
                <p className="text-stone-600 text-xs uppercase tracking-widest font-bold mb-1">Details</p>
                <p className="text-stone-300">{b.activity}</p><p className="text-stone-400">{b.date} · {b.slot} · {b.guests} guests</p>
              </div>
              <div>
                <p className="text-stone-600 text-xs uppercase tracking-widest font-bold mb-1">Notes</p>
                <p className="text-stone-400 italic">{b.message||"None"}</p>
                <p className="text-stone-600 text-xs mt-1">Created: {new Date(b.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function BookingsPage({ onCountChange }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState("all");
  const [sortBy, setSortBy]     = useState("createdAt");
  const [sortDir, setSortDir]   = useState("desc");
  const [delConfirm, setDelConfirm] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await bookingsApi.getAll({
        ...(statusFilter !== "all" ? { status: statusFilter } : {}),
        ...(activityFilter !== "all" ? { activity: activityFilter } : {}),
        ...(search ? { search } : {}),
        sort: sortBy, order: sortDir, limit: 100,
      });
      setBookings(res.data);
      onCountChange?.(res.data.filter(b => b.status === "pending").length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, activityFilter, search, sortBy, sortDir]);

  useEffect(() => { load(); }, [load]);

  const handleStatus = async (id, status) => {
    try {
      await bookingsApi.updateStatus(id, status);
      load();
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await bookingsApi.delete(id);
      load();
    } catch (err) { setError(err.message); }
  };

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
  };

  const activities = [...new Set(bookings.map(b => b.activity))].sort();
  const counts = { all: bookings.length, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
  bookings.forEach(b => { if (counts[b.status] !== undefined) counts[b.status]++; });

  const SortBtn = ({ col, label }) => (
    <button onClick={() => toggleSort(col)} className="flex items-center gap-1 hover:text-stone-200 group">
      {label}<span className="text-stone-700 group-hover:text-stone-500">{sortBy===col?(sortDir==="asc"?"↑":"↓"):"↕"}</span>
    </button>
  );

  return (
    <div className="max-w-7xl space-y-5">
      {error && <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-4 text-red-400 text-sm">{error}</div>}

      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-sm">🔍</span>
          <input className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-cyan-500/50" placeholder="Search name, email..." value={search} onChange={e => setSearch(e.target.value)} style={{ fontFamily: "'DM Sans', sans-serif" }} />
        </div>
        <div className="flex items-center gap-1 bg-stone-800 rounded-xl p-1">
          {Object.entries(counts).map(([s, c]) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${statusFilter===s?"bg-stone-700 text-white":"text-stone-500 hover:text-stone-300"}`} style={{ fontFamily: "'Syne', sans-serif" }}>
              {s} <span className="opacity-60">({c})</span>
            </button>
          ))}
        </div>
        <select className="bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-sm text-stone-300 focus:outline-none" value={activityFilter} onChange={e => setActivityFilter(e.target.value)} style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <option value="all">All Activities</option>
          {activities.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-800 bg-stone-800/40">
                {[["id","ID"],["name","Guest"],["activity","Activity"],["date","Date"],["slot","Slot"],["guests","Guests"],["total","Total"],["status","Status"]].map(([col,label])=>(
                  <th key={col} className="text-left text-stone-500 text-xs font-bold tracking-widest uppercase py-3 px-4" style={{ fontFamily: "'Syne', sans-serif" }}><SortBtn col={col} label={label} /></th>
                ))}
                <th className="text-left text-stone-500 text-xs font-bold tracking-widest uppercase py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="py-16 text-center"><svg className="animate-spin w-6 h-6 text-cyan-500 mx-auto" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg></td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan={9} className="py-16 text-center text-stone-600 text-sm">No bookings found</td></tr>
              ) : bookings.map(b => (
                <BookingRow key={b._id} b={b} onStatus={handleStatus} onDelete={handleDelete} delConfirm={delConfirm} setDelConfirm={setDelConfirm} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-stone-800 px-4 py-3 flex justify-between">
          <p className="text-stone-500 text-xs">Showing {bookings.length} bookings</p>
          <p className="text-stone-500 text-xs">Click a row to expand</p>
        </div>
      </div>
    </div>
  );
}
