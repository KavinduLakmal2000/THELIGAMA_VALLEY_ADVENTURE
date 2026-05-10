import { useState, useEffect } from "react";
import { getSlots, toggleSlot, getBlockedDates, addBlockedDate, removeBlockedDate, getBookings } from "../store/mockData";

export default function SchedulePage() {
  const [slots, setSlots]     = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newDate, setNewDate]   = useState("");
  const [newReason, setNewReason] = useState("");

  useEffect(() => {
    setSlots(getSlots());
    setBlocked(getBlockedDates());
    setBookings(getBookings());
  }, []);

  const handleToggleSlot = (id) => {
    const updated = toggleSlot(id);
    setSlots(updated);
  };

  const handleAddBlock = () => {
    if (!newDate || !newReason.trim()) return;
    if (blocked.some(b => b.date === newDate)) return;
    const updated = addBlockedDate({ date: newDate, reason: newReason.trim() });
    setBlocked(updated);
    setNewDate("");
    setNewReason("");
  };

  const handleRemoveBlock = (date) => {
    const updated = removeBlockedDate(date);
    setBlocked(updated);
  };

  // Busiest days of week from booking data
  const dayCount = [0, 0, 0, 0, 0, 0, 0];
  bookings.forEach(b => {
    if (!b.date) return;
    const d = new Date(b.date).getDay();
    dayCount[d]++;
  });
  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const maxDay = Math.max(...dayCount, 1);

  // Slot booking breakdown
  const slotCount = { Morning: 0, Midday: 0, Afternoon: 0 };
  bookings.forEach(b => {
    if (slotCount[b.slot] !== undefined) slotCount[b.slot]++;
  });

  return (
    <div className="max-w-5xl space-y-5">
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Time slot toggles */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
          <h2 className="text-white font-black text-lg mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Time Slots</h2>
          <p className="text-stone-500 text-sm mb-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Disable a slot to prevent new bookings in that time window.
          </p>

          <div className="space-y-3">
            {slots.map(slot => (
              <div
                key={slot.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                  slot.active
                    ? "bg-stone-800/50 border-stone-700"
                    : "bg-stone-800/20 border-stone-800/40 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${slot.active ? "bg-green-500" : "bg-stone-700"}`} />
                  <div>
                    <p className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>{slot.label}</p>
                    <p className="text-stone-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>{slot.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-stone-600 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {slotCount[slot.label] || 0} bookings
                  </span>
                  {/* Toggle switch */}
                  <button
                    onClick={() => handleToggleSlot(slot.id)}
                    className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
                      slot.active ? "bg-cyan-500" : "bg-stone-700"
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                      slot.active ? "translate-x-5" : "translate-x-0.5"
                    }`} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Hours reminder */}
          <div className="mt-5 bg-stone-800/40 border border-stone-800 rounded-xl p-4 text-xs text-stone-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <p className="font-bold text-stone-400 mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Operating Hours</p>
            <p>Gates open: <span className="text-stone-300">7:30 AM</span> — Close: <span className="text-stone-300">9:00 PM</span></p>
            <p className="mt-1">Open <span className="text-stone-300">Monday – Sunday</span>, all year round</p>
          </div>
        </div>

        {/* Block dates */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
          <h2 className="text-white font-black text-lg mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Block Dates</h2>
          <p className="text-stone-500 text-sm mb-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Block specific dates for holidays, maintenance, or weather closures.
          </p>

          {/* Add form */}
          <div className="space-y-3 mb-5 p-4 bg-stone-800/40 border border-stone-800 rounded-xl">
            <div>
              <label className="text-stone-500 text-xs uppercase tracking-widest font-bold block mb-1.5" style={{ fontFamily: "'Syne', sans-serif" }}>Date</label>
              <input
                type="date"
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-stone-200 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                style={{ fontFamily: "'DM Sans', sans-serif", colorScheme: "dark" }}
              />
            </div>
            <div>
              <label className="text-stone-500 text-xs uppercase tracking-widest font-bold block mb-1.5" style={{ fontFamily: "'Syne', sans-serif" }}>Reason</label>
              <input
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-stone-200 text-sm placeholder-stone-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                placeholder="e.g. Public Holiday, Maintenance Day"
                value={newReason}
                onChange={e => setNewReason(e.target.value)}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>
            <button
              onClick={handleAddBlock}
              disabled={!newDate || !newReason.trim()}
              className="w-full py-2.5 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl text-sm font-black hover:bg-red-500/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              🚫 Block This Date
            </button>
          </div>

          {/* Blocked list */}
          <div className="space-y-2">
            {blocked.length === 0 ? (
              <p className="text-stone-600 text-sm text-center py-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>No dates blocked</p>
            ) : (
              blocked.sort((a, b) => a.date.localeCompare(b.date)).map(b => (
                <div key={b.date} className="flex items-center justify-between bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-stone-200 text-sm font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {new Date(b.date + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                    </p>
                    <p className="text-red-400/70 text-xs">{b.reason}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveBlock(b.date)}
                    className="text-stone-700 hover:text-red-400 transition-colors text-sm p-1"
                  >✕</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Analytics: busy days + slot breakdown */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Day of week heatmap */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
          <h2 className="text-white font-black text-lg mb-5" style={{ fontFamily: "'Syne', sans-serif" }}>Bookings by Day of Week</h2>
          <div className="space-y-3">
            {dayNames.map((name, i) => (
              <div key={name}>
                <div className="flex justify-between text-xs mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <span className="text-stone-400 w-24">{name}</span>
                  <span className="text-stone-600">{dayCount[i]} bookings</span>
                </div>
                <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-700"
                    style={{ width: `${(dayCount[i] / maxDay) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slot breakdown */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
          <h2 className="text-white font-black text-lg mb-5" style={{ fontFamily: "'Syne', sans-serif" }}>Slot Popularity</h2>
          <div className="space-y-4">
            {slots.map(slot => {
              const count = slotCount[slot.label] || 0;
              const total = Object.values(slotCount).reduce((s, v) => s + v, 0) || 1;
              return (
                <div key={slot.id} className={`p-4 rounded-xl border ${slot.active ? "border-stone-700 bg-stone-800/30" : "border-stone-800/40 bg-stone-800/10 opacity-50"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>{slot.label}</p>
                      <p className="text-stone-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>{slot.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400 font-black text-xl" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>{count}</p>
                      <p className="text-stone-600 text-xs">{Math.round(count / total * 100)}%</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full"
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            ⚠️ Schedules may vary with weather. Always communicate changes to confirmed guests.
          </div>
        </div>
      </div>
    </div>
  );
}
