import { useState, useEffect } from "react";
import { getBookings, getBlockedDates, addBlockedDate, removeBlockedDate } from "../store/mockData";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const STATUS_COLOR = {
  confirmed: "bg-green-500",
  pending:   "bg-amber-500",
  cancelled: "bg-red-500",
  completed: "bg-stone-500",
};
const STATUS_TEXT = {
  confirmed: "text-green-400 bg-green-500/10 border-green-500/25",
  pending:   "text-amber-400 bg-amber-500/10 border-amber-500/25",
  cancelled: "text-red-400 bg-red-500/10 border-red-500/25",
  completed: "text-stone-400 bg-stone-600/30 border-stone-600/40",
};

export default function CalendarPage() {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected,  setSelected]  = useState(null);
  const [bookings,  setBookings]  = useState([]);
  const [blocked,   setBlocked]   = useState([]);
  const [blockReason, setBlockReason] = useState("");

  useEffect(() => {
    setBookings(getBookings());
    setBlocked(getBlockedDates());
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayStr    = today.toISOString().split("T")[0];

  const pad = (n) => String(n).padStart(2, "0");
  const dateStr = (d) => `${viewYear}-${pad(viewMonth + 1)}-${pad(d)}`;

  const bookingsByDate = {};
  bookings.forEach(b => {
    if (!bookingsByDate[b.date]) bookingsByDate[b.date] = [];
    bookingsByDate[b.date].push(b);
  });

  const isBlocked   = (d) => blocked.some(b => b.date === dateStr(d));
  const blockReason2 = (d) => blocked.find(b => b.date === dateStr(d))?.reason;

  const selectedStr   = selected ? dateStr(selected) : null;
  const selectedBookings = selectedStr ? (bookingsByDate[selectedStr] || []) : [];
  const selectedBlocked  = selectedStr ? blocked.find(b => b.date === selectedStr) : null;

  const handleBlock = () => {
    if (!selected || !blockReason.trim()) return;
    const updated = addBlockedDate({ date: dateStr(selected), reason: blockReason.trim() });
    setBlocked(updated);
    setBlockReason("");
  };

  const handleUnblock = () => {
    if (!selectedStr) return;
    const updated = removeBlockedDate(selectedStr);
    setBlocked(updated);
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="max-w-7xl">
      <div className="grid lg:grid-cols-3 gap-5 items-start">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-2xl p-6">
          {/* Nav */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="w-9 h-9 flex items-center justify-center rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-lg transition-colors">‹</button>
            <h2 className="text-white font-black text-2xl" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>
              {MONTHS[viewMonth]} {viewYear}
            </h2>
            <button onClick={nextMonth} className="w-9 h-9 flex items-center justify-center rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-lg transition-colors">›</button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-stone-600 text-xs font-bold tracking-widest py-2" style={{ fontFamily: "'Syne', sans-serif" }}>{d}</div>
            ))}
          </div>

          {/* Cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />;
              const ds        = dateStr(day);
              const dayBooks  = bookingsByDate[ds] || [];
              const blocked_  = isBlocked(day);
              const isToday   = ds === todayStr;
              const isSel     = day === selected;

              return (
                <button
                  key={day}
                  onClick={() => setSelected(day === selected ? null : day)}
                  className={`relative min-h-[68px] p-1.5 rounded-xl border text-left transition-all duration-150 ${
                    isSel       ? "bg-cyan-500/15 border-cyan-500/40 ring-1 ring-cyan-500/30"
                    : blocked_  ? "bg-red-500/10 border-red-500/20 hover:border-red-500/40"
                    : isToday   ? "bg-stone-800 border-cyan-500/30"
                    : "bg-stone-800/30 border-stone-800 hover:bg-stone-800/60 hover:border-stone-700"
                  }`}
                >
                  <span className={`text-sm font-bold block mb-1 ${
                    isToday  ? "text-cyan-400"
                    : blocked_ ? "text-red-400"
                    : "text-stone-300"
                  }`} style={{ fontFamily: "'Syne', sans-serif" }}>
                    {day}
                  </span>

                  {blocked_ && (
                    <div className="text-red-400 text-xs leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      🚫 <span className="hidden sm:inline">{blockReason2(day)}</span>
                    </div>
                  )}

                  {/* Booking dots */}
                  {dayBooks.length > 0 && (
                    <div className="flex flex-wrap gap-0.5 mt-1">
                      {dayBooks.slice(0, 4).map(b => (
                        <div key={b.id} className={`w-1.5 h-1.5 rounded-full ${STATUS_COLOR[b.status]}`} />
                      ))}
                      {dayBooks.length > 4 && (
                        <span className="text-stone-600 text-xs">+{dayBooks.length - 4}</span>
                      )}
                    </div>
                  )}

                  {dayBooks.length > 0 && (
                    <div className="text-stone-500 text-xs mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {dayBooks.length} booking{dayBooks.length > 1 ? "s" : ""}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-stone-800">
            {Object.entries(STATUS_COLOR).map(([s, c]) => (
              <div key={s} className="flex items-center gap-1.5 text-xs text-stone-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <div className={`w-2.5 h-2.5 rounded-full ${c}`} />
                <span className="capitalize">{s}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/40 border border-red-500/50" />
              <span>Blocked</span>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Selected day detail */}
          {selected ? (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-black" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {new Date(viewYear, viewMonth, selected).toLocaleDateString("en-GB", { weekday: "short", month: "short", day: "numeric" })}
                </h3>
                <button onClick={() => setSelected(null)} className="text-stone-600 hover:text-stone-400 transition-colors">✕</button>
              </div>

              {/* Bookings for this day */}
              {selectedBookings.length === 0 && !selectedBlocked && (
                <p className="text-stone-600 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>No bookings for this day.</p>
              )}

              <div className="space-y-2 mb-4">
                {selectedBookings.map(b => (
                  <div key={b.id} className="bg-stone-800/60 rounded-xl p-3">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <p className="text-stone-200 font-semibold text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{b.name}</p>
                        <p className="text-stone-500 text-xs">{b.activity}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold border flex-shrink-0 ${STATUS_TEXT[b.status]}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                        {b.status}
                      </span>
                    </div>
                    <div className="flex gap-3 text-xs text-stone-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <span>⏱ {b.slot}</span>
                      <span>👥 {b.guests}</span>
                      <span>💰 LKR {b.total?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Block / unblock */}
              {selectedBlocked ? (
                <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-3 mb-3">
                  <p className="text-red-400 text-xs font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>🚫 Blocked</p>
                  <p className="text-stone-400 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>{selectedBlocked.reason}</p>
                  <button
                    onClick={handleUnblock}
                    className="mt-2 text-xs text-red-400 hover:text-red-300 font-bold underline"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >Remove block</button>
                </div>
              ) : (
                <div>
                  <p className="text-stone-500 text-xs uppercase tracking-widest font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Block this date</p>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-red-500/50"
                      placeholder="Reason (e.g. Holiday)"
                      value={blockReason}
                      onChange={e => setBlockReason(e.target.value)}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                    <button
                      onClick={handleBlock}
                      className="px-3 py-2 bg-red-500/15 border border-red-500/25 text-red-400 rounded-xl text-xs font-bold hover:bg-red-500/25 transition-colors"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >Block</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 text-center">
              <p className="text-stone-600 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Click a day to see bookings and manage availability
              </p>
            </div>
          )}

          {/* Blocked dates list */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
            <h3 className="text-white font-black text-sm mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
              Blocked Dates
            </h3>
            {blocked.length === 0 ? (
              <p className="text-stone-600 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>No dates blocked</p>
            ) : (
              <div className="space-y-2">
                {blocked.sort((a, b) => a.date.localeCompare(b.date)).map(b => (
                  <div key={b.date} className="flex items-center justify-between bg-stone-800/60 rounded-xl px-3 py-2">
                    <div>
                      <p className="text-stone-300 text-xs font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{b.date}</p>
                      <p className="text-stone-600 text-xs">{b.reason}</p>
                    </div>
                    <button
                      onClick={() => { const u = removeBlockedDate(b.date); setBlocked(u); }}
                      className="text-stone-700 hover:text-red-400 transition-colors text-sm"
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Monthly summary */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
            <h3 className="text-white font-black text-sm mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
              {MONTHS[viewMonth]} Summary
            </h3>
            {(() => {
              const monthStr = `${viewYear}-${pad(viewMonth + 1)}`;
              const month = bookings.filter(b => b.date?.startsWith(monthStr));
              const revenue = month.filter(b => b.status !== "cancelled").reduce((s, b) => s + (b.total || 0), 0);
              return (
                <div className="grid grid-cols-2 gap-3 text-center">
                  {[
                    { label: "Bookings", value: month.length },
                    { label: "Revenue",  value: `LKR ${(revenue/1000).toFixed(0)}K` },
                    { label: "Pending",  value: month.filter(b => b.status === "pending").length },
                    { label: "Blocked",  value: blocked.filter(b => b.date?.startsWith(monthStr)).length },
                  ].map(s => (
                    <div key={s.label} className="bg-stone-800/50 rounded-xl p-3">
                      <p className="text-white font-black text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>{s.value}</p>
                      <p className="text-stone-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
