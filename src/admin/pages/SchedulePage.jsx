import { useState, useEffect } from "react";
import { scheduleApi, bookingsApi } from "../../api/client";

export default function SchedulePage() {
  const [slots,    setSlots]    = useState([]);
  const [blocked,  setBlocked]  = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newDate,   setNewDate]   = useState("");
  const [newReason, setNewReason] = useState("");
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    Promise.all([
      scheduleApi.adminGetSlots(),
      scheduleApi.adminGetBlocked(),
      bookingsApi.getAll({ limit: 500 }),
    ]).then(([s, bl, bk]) => {
      setSlots(s.data);
      setBlocked(bl.data);
      setBookings(bk.data);
    }).catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleSlot = async (id) => {
    try {
      const res = await scheduleApi.toggleSlot(id);
      setSlots(sl => sl.map(s => s.id===id ? res.data : s));
    } catch (err) { setError(err.message); }
  };

  const handleAddBlock = async () => {
    if (!newDate||!newReason.trim()) return;
    if (blocked.some(b=>b.date===newDate)) { setError("Date already blocked."); return; }
    try {
      const res = await scheduleApi.addBlocked(newDate, newReason.trim());
      setBlocked(b=>[...b,res.data]);
      setNewDate(""); setNewReason("");
    } catch (err) { setError(err.message); }
  };

  const handleRemoveBlock = async (date) => {
    try {
      await scheduleApi.removeBlocked(date);
      setBlocked(b=>b.filter(x=>x.date!==date));
    } catch (err) { setError(err.message); }
  };

  const dayCount = [0,0,0,0,0,0,0];
  bookings.forEach(b => { if(b.date){const d=new Date(b.date+"T12:00:00").getDay(); dayCount[d]++;} });
  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const maxDay = Math.max(...dayCount,1);

  const slotCount = {};
  slots.forEach(s => { slotCount[s.label]=0; });
  bookings.forEach(b => { if(slotCount[b.slot]!==undefined) slotCount[b.slot]++; });

  if (loading) return <div className="flex justify-center py-20"><svg className="animate-spin w-8 h-8 text-cyan-500" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg></div>;

  return (
    <div className="max-w-5xl space-y-5">
      {error && <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-4 text-red-400 text-sm">{error}</div>}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
          <h2 className="text-white font-black text-lg mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>Time Slots</h2>
          <p className="text-stone-500 text-sm mb-5">Disable a slot to prevent new bookings.</p>
          <div className="space-y-3">
            {slots.map(slot => (
              <div key={slot.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${slot.active?"bg-stone-800/50 border-stone-700":"bg-stone-800/20 border-stone-800/40 opacity-60"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${slot.active?"bg-green-500":"bg-stone-700"}`}/>
                  <div>
                    <p className="text-white font-bold text-sm">{slot.label}</p>
                    <p className="text-stone-500 text-xs">{slot.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-stone-600 text-xs">{slotCount[slot.label]||0} bookings</span>
                  <button onClick={()=>handleToggleSlot(slot.id)} className={`w-11 h-6 rounded-full relative transition-colors ${slot.active?"bg-cyan-500":"bg-stone-700"}`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${slot.active?"translate-x-5":"translate-x-0.5"}`}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 bg-stone-800/40 border border-stone-800 rounded-xl p-4 text-xs text-stone-500">
            <p className="font-bold text-stone-400 mb-1">Operating Hours</p>
            <p>Gates open: <span className="text-stone-300">7:30 AM</span> — Close: <span className="text-stone-300">9:00 PM</span></p>
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
          <h2 className="text-white font-black text-lg mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>Block Dates</h2>
          <p className="text-stone-500 text-sm mb-5">Block dates for holidays or maintenance.</p>
          <div className="space-y-3 mb-5 p-4 bg-stone-800/40 border border-stone-800 rounded-xl">
            <div>
              <label className="text-stone-500 text-xs uppercase tracking-widest font-bold block mb-1.5">Date</label>
              <input type="date" className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-stone-200 text-sm focus:outline-none focus:border-cyan-500/50" value={newDate} onChange={e=>setNewDate(e.target.value)} style={{ colorScheme:"dark" }} />
            </div>
            <div>
              <label className="text-stone-500 text-xs uppercase tracking-widest font-bold block mb-1.5">Reason</label>
              <input className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-stone-200 text-sm placeholder-stone-600 focus:outline-none focus:border-cyan-500/50" placeholder="e.g. Public Holiday" value={newReason} onChange={e=>setNewReason(e.target.value)} />
            </div>
            <button onClick={handleAddBlock} disabled={!newDate||!newReason.trim()} className="w-full py-2.5 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl text-sm font-black hover:bg-red-500/25 disabled:opacity-40 disabled:cursor-not-allowed">🚫 Block This Date</button>
          </div>
          <div className="space-y-2">
            {blocked.length===0 ? <p className="text-stone-600 text-sm text-center py-4">No dates blocked</p>
              : blocked.sort((a,b)=>a.date.localeCompare(b.date)).map(b=>(
                <div key={b.date} className="flex items-center justify-between bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
                  <div><p className="text-stone-200 text-sm font-semibold">{new Date(b.date+"T12:00:00").toLocaleDateString("en-GB",{weekday:"short",month:"short",day:"numeric",year:"numeric"})}</p><p className="text-red-400/70 text-xs">{b.reason}</p></div>
                  <button onClick={()=>handleRemoveBlock(b.date)} className="text-stone-700 hover:text-red-400 text-sm p-1">✕</button>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
          <h2 className="text-white font-black text-lg mb-5">Bookings by Day</h2>
          <div className="space-y-3">
            {dayNames.map((name,i)=>(
              <div key={name}>
                <div className="flex justify-between text-xs mb-1"><span className="text-stone-400 w-24">{name}</span><span className="text-stone-600">{dayCount[i]}</span></div>
                <div className="h-2 bg-stone-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full" style={{width:`${(dayCount[i]/maxDay)*100}%`}}/></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
          <h2 className="text-white font-black text-lg mb-5">Slot Popularity</h2>
          <div className="space-y-4">
            {slots.map(slot=>{
              const count = slotCount[slot.label]||0;
              const total = Object.values(slotCount).reduce((s,v)=>s+v,0)||1;
              return (
                <div key={slot.id} className={`p-4 rounded-xl border ${slot.active?"border-stone-700 bg-stone-800/30":"border-stone-800/40 bg-stone-800/10 opacity-50"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div><p className="text-white font-bold text-sm">{slot.label}</p><p className="text-stone-500 text-xs">{slot.time}</p></div>
                    <div className="text-right"><p className="text-cyan-400 font-black text-xl" style={{ fontFamily:"'Bebas Neue',sans-serif" }}>{count}</p><p className="text-stone-600 text-xs">{Math.round(count/total*100)}%</p></div>
                  </div>
                  <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full" style={{width:`${(count/total)*100}%`}}/></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
