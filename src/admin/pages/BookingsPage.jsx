import { useState, useEffect } from "react";
import { getBookings, updateBookingStatus, deleteBooking } from "../store/mockData";

const STATUS_COLOR = {
  confirmed: "bg-green-500/15 text-green-400 border-green-500/25",
  pending:   "bg-amber-500/15 text-amber-400 border-amber-500/25",
  cancelled: "bg-red-500/15  text-red-400  border-red-500/25",
  completed: "bg-stone-600/40 text-stone-400 border-stone-600/40",
};

function BookingRow({ b, onStatus, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="border-b border-stone-800/60 hover:bg-stone-800/20 transition-colors cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <td className="py-3 px-4 text-stone-500 font-mono text-xs whitespace-nowrap">{b.id}</td>
        <td className="py-3 px-4">
          <div className="text-stone-200 font-semibold text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{b.name}</div>
          <div className="text-stone-500 text-xs">{b.email}</div>
        </td>
        <td className="py-3 px-4 text-stone-400 text-sm hidden md:table-cell" style={{ fontFamily: "'DM Sans', sans-serif" }}>{b.activity}</td>
        <td className="py-3 px-4 text-stone-300 text-sm whitespace-nowrap hidden sm:table-cell" style={{ fontFamily: "'DM Sans', sans-serif" }}>{b.date}</td>
        <td className="py-3 px-4 text-stone-400 text-sm hidden lg:table-cell">{b.slot}</td>
        <td className="py-3 px-4 text-stone-400 text-sm hidden lg:table-cell">{b.guests}</td>
        <td className="py-3 px-4 text-cyan-400 font-bold text-sm whitespace-nowrap hidden xl:table-cell" style={{ fontFamily: "'Syne', sans-serif" }}>
          LKR {b.total?.toLocaleString()}
        </td>
        <td className="py-3 px-4">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLOR[b.status]}`} style={{ fontFamily: "'Syne', sans-serif" }}>
            {b.status}
          </span>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            {b.status === "pending" && (
              <button
                onClick={() => onStatus(b.id, "confirmed")}
                className="px-2 py-1 bg-green-500/10 border border-green-500/25 text-green-400 rounded-lg text-xs font-bold hover:bg-green-500/20 transition-colors"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >✓</button>
            )}
            {b.status === "confirmed" && (
              <button
                onClick={() => onStatus(b.id, "completed")}
                className="px-2 py-1 bg-stone-600/30 border border-stone-600/40 text-stone-400 rounded-lg text-xs font-bold hover:bg-stone-600/50 transition-colors"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >Done</button>
            )}
            {(b.status === "pending" || b.status === "confirmed") && (
              <button
                onClick={() => onStatus(b.id, "cancelled")}
                className="px-2 py-1 bg-red-500/10 border border-red-500/25 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-colors"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >✗</button>
            )}
            <button
              onClick={() => onDelete(b.id)}
              className="px-2 py-1 text-stone-700 hover:text-red-400 text-xs transition-colors"
            >🗑</button>
          </div>
        </td>
      </tr>
      {/* Expanded row */}
      {expanded && (
        <tr className="bg-stone-800/20 border-b border-stone-800/40">
          <td colSpan={9} className="px-4 py-4">
            <div className="grid sm:grid-cols-3 gap-4 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <div>
                <p className="text-stone-600 text-xs uppercase tracking-widest font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Contact</p>
                <p className="text-stone-300">{b.phone}</p>
                <p className="text-stone-400">{b.email}</p>
              </div>
              <div>
                <p className="text-stone-600 text-xs uppercase tracking-widest font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Booking Details</p>
                <p className="text-stone-300">{b.activity}</p>
                <p className="text-stone-400">{b.date} · {b.slot} · {b.guests} guests</p>
              </div>
              <div>
                <p className="text-stone-600 text-xs uppercase tracking-widest font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Special Requests</p>
                <p className="text-stone-400 italic">{b.message || "None"}</p>
                <p className="text-stone-600 text-xs mt-1">Booked: {b.createdAt}</p>
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
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState("all");
  const [sortBy, setSortBy]     = useState("date");
  const [sortDir, setSortDir]   = useState("asc");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const b = getBookings();
    setBookings(b);
    onCountChange?.(b.filter(x => x.status === "pending").length);
  }, []);

  const handleStatus = (id, status) => {
    const updated = updateBookingStatus(id, status);
    setBookings(updated);
    onCountChange?.(updated.filter(x => x.status === "pending").length);
  };

  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      const updated = deleteBooking(id);
      setBookings(updated);
      onCountChange?.(updated.filter(x => x.status === "pending").length);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
  };

  const activities = [...new Set(bookings.map(b => b.activity))].sort();

  const filtered = bookings
    .filter(b => statusFilter === "all" || b.status === statusFilter)
    .filter(b => activityFilter === "all" || b.activity === activityFilter)
    .filter(b => {
      const q = search.toLowerCase();
      return !q || b.name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.activity.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      let va = a[sortBy] ?? "", vb = b[sortBy] ?? "";
      if (sortBy === "total" || sortBy === "guests") { va = +va; vb = +vb; }
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

  const SortBtn = ({ col, label }) => (
    <button onClick={() => toggleSort(col)} className="flex items-center gap-1 hover:text-stone-200 transition-colors group">
      {label}
      <span className="text-stone-700 group-hover:text-stone-500">
        {sortBy === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
      </span>
    </button>
  );

  const counts = { all: bookings.length, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
  bookings.forEach(b => { if (counts[b.status] !== undefined) counts[b.status]++; });

  return (
    <div className="max-w-7xl space-y-5">
      {/* Filters */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-sm">🔍</span>
          <input
            className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
            placeholder="Search by name, email, ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />
        </div>

        {/* Status tabs */}
        <div className="flex items-center gap-1 bg-stone-800 rounded-xl p-1">
          {Object.entries(counts).map(([s, c]) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                statusFilter === s ? "bg-stone-700 text-white shadow" : "text-stone-500 hover:text-stone-300"
              }`}
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {s} <span className="opacity-60">({c})</span>
            </button>
          ))}
        </div>

        {/* Activity filter */}
        <select
          className="bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-sm text-stone-300 focus:outline-none focus:border-cyan-500/50"
          value={activityFilter}
          onChange={e => setActivityFilter(e.target.value)}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <option value="all">All Activities</option>
          {activities.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-800 bg-stone-800/40">
                {[
                  { col:"id", label:"ID" },
                  { col:"name", label:"Guest" },
                  { col:"activity", label:"Activity", cls:"hidden md:table-cell" },
                  { col:"date", label:"Date", cls:"hidden sm:table-cell" },
                  { col:"slot", label:"Slot", cls:"hidden lg:table-cell" },
                  { col:"guests", label:"Guests", cls:"hidden lg:table-cell" },
                  { col:"total", label:"Total", cls:"hidden xl:table-cell" },
                  { col:"status", label:"Status" },
                ].map(({ col, label, cls="" }) => (
                  <th key={col} className={`text-left text-stone-500 text-xs font-bold tracking-widest uppercase py-3 px-4 ${cls}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                    <SortBtn col={col} label={label} />
                  </th>
                ))}
                <th className="text-left text-stone-500 text-xs font-bold tracking-widest uppercase py-3 px-4" style={{ fontFamily: "'Syne', sans-serif" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-stone-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    No bookings match your filters
                  </td>
                </tr>
              ) : (
                filtered.map(b => (
                  <BookingRow
                    key={b.id}
                    b={{ ...b, id: deleteConfirm === b.id ? "⚠️ Click again to confirm delete" : b.id }}
                    onStatus={handleStatus}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-800 px-4 py-3 flex justify-between items-center">
          <p className="text-stone-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Showing {filtered.length} of {bookings.length} bookings
          </p>
          <p className="text-stone-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Click a row to expand details
          </p>
        </div>
      </div>
    </div>
  );
}
