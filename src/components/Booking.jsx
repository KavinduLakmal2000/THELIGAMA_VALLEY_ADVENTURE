import { useState, useEffect } from "react";
import { activitiesApi, scheduleApi, bookingsApi } from "../api/client";

// ─── Mini Calendar ────────────────────────────────────────────────────────────
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function MiniCalendar({ selected, onSelect, minDate, blockedDates = [] }) {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(selected ? selected.getFullYear() : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected ? selected.getMonth()    : today.getMonth());

  const prevMonth = () => { if (viewMonth===0){setViewMonth(11);setViewYear(y=>y-1);}else setViewMonth(m=>m-1); };
  const nextMonth = () => { if (viewMonth===11){setViewMonth(0);setViewYear(y=>y+1);}else setViewMonth(m=>m+1); };

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();
  const pad = n => String(n).padStart(2,"0");

  const isDisabled = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    if (minDate && d < minDate) return true;
    const ds = `${viewYear}-${pad(viewMonth+1)}-${pad(day)}`;
    return blockedDates.includes(ds);
  };
  const isBlocked  = (day) => { const ds=`${viewYear}-${pad(viewMonth+1)}-${pad(day)}`; return blockedDates.includes(ds); };
  const isSelected = (day) => selected && selected.getDate()===day && selected.getMonth()===viewMonth && selected.getFullYear()===viewYear;
  const isToday    = (day) => today.getDate()===day && today.getMonth()===viewMonth && today.getFullYear()===viewYear;

  const cells = [];
  for (let i=0; i<firstDay; i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-stone-900 border border-stone-700 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors">‹</button>
        <span className="text-white font-black text-sm tracking-wider" style={{ fontFamily:"'Syne',sans-serif" }}>{MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors">›</button>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES.map(d=><div key={d} className="text-center text-stone-600 text-xs font-bold py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day,i)=>(
          <div key={i} className="flex justify-center">
            {day ? (
              <button
                onClick={()=>!isDisabled(day) && onSelect(new Date(viewYear,viewMonth,day))}
                disabled={isDisabled(day)}
                title={isBlocked(day)?"This date is unavailable":""}
                className={`w-8 h-8 rounded-full text-sm font-semibold transition-all ${
                  isSelected(day) ? "bg-cyan-500 text-stone-950 font-black shadow-lg shadow-cyan-500/30"
                  : isBlocked(day) ? "bg-red-500/10 text-red-400/50 cursor-not-allowed line-through"
                  : isDisabled(day) ? "text-stone-700 cursor-not-allowed"
                  : isToday(day)  ? "border border-cyan-500/50 text-cyan-400"
                  : "text-stone-300 hover:bg-stone-700 hover:text-white"
                }`}
              >{day}</button>
            ) : null}
          </div>
        ))}
      </div>
      {blockedDates.length>0 && (
        <p className="text-stone-600 text-xs mt-3 text-center">Strikethrough dates are unavailable</p>
      )}
    </div>
  );
}

// ─── Booking Section ──────────────────────────────────────────────────────────
export default function Booking() {
  const today = new Date();
  today.setHours(0,0,0,0);

  // Remote data
  const [activities,    setActivities]    = useState([]);
  const [activeSlots,   setActiveSlots]   = useState([]);
  const [blockedDates,  setBlockedDates]  = useState([]);
  const [loadingData,   setLoadingData]   = useState(true);

  // Form state
  const [form, setForm] = useState({ name:"", email:"", phone:"", activity:"", guests:"1", slot:"", date:null, message:"" });
  const [errors,    setErrors]    = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [booking,   setBooking]   = useState(null); // server response

  // Load activities, slots, blocked dates in parallel on mount
  useEffect(() => {
    Promise.all([
      activitiesApi.getAll(),
      scheduleApi.getSlots(),
      scheduleApi.getBlocked(),
    ]).then(([acts, slots, blocked]) => {
      setActivities(acts.data);
      setActiveSlots(slots.data);
      setBlockedDates(blocked.data.map(b => b.date));
    }).catch(() => {
      // Fallback: keep empty arrays, form still works without live data
    }).finally(() => setLoadingData(false));
  }, []);

  const set = (k, v) => {
    setForm(f=>({...f,[k]:v}));
    setErrors(e=>({...e,[k]:undefined}));
    setSubmitError("");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.activity)     e.activity = "Please select an activity";
    if (!form.date)         e.date = "Please select a date";
    if (!form.slot)         e.slot = "Please select a time slot";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setSubmitting(true);
    setSubmitError("");

    try {
      // Calculate total from selected activity price
      const selectedAct = activities.find(a => a.title === form.activity);
      const total = selectedAct ? selectedAct.price * parseInt(form.guests) : 0;

      // Extract slot label only (e.g. "Morning" from "Morning (8:00 AM…)")
      const slotLabel = form.slot.split(" ")[0];

      const res = await bookingsApi.submit({
        name:     form.name.trim(),
        email:    form.email.trim(),
        phone:    form.phone.trim(),
        activity: form.activity,
        date:     form.date.toISOString().split("T")[0],
        slot:     slotLabel,
        guests:   parseInt(form.guests),
        total,
        message:  form.message.trim(),
      });

      setBooking(res.data);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setBooking(null);
    setForm({ name:"", email:"", phone:"", activity:"", guests:"1", slot:"", date:null, message:"" });
    setErrors({});
    setSubmitError("");
  };

  const inputClass = (field) =>
    `w-full bg-stone-900 border ${errors[field]?"border-red-500/60":"border-stone-700"} rounded-xl px-4 py-3 text-stone-200 text-sm placeholder-stone-600 focus:outline-none focus:border-cyan-500/60 transition-colors`;

  // Slot display — use live data if available, fallback to static
  const slotOptions = activeSlots.length > 0
    ? activeSlots.map(s => `${s.label} (${s.time})`)
    : ["Morning (8:00 AM – 11:00 AM)", "Midday (11:30 AM – 2:30 PM)", "Afternoon (3:00 PM – 5:00 PM)"];

  // Price estimate
  const selectedAct  = activities.find(a => a.title === form.activity);
  const priceEst     = selectedAct ? selectedAct.price * parseInt(form.guests || 1) : null;

  return (
    <section id="booking" className="bg-stone-950 py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(6,182,212,0.07)_0%,_transparent_60%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-cyan-400 text-xs font-bold tracking-[0.35em] uppercase mb-4" style={{ fontFamily:"'Syne',sans-serif" }}>— Reserve Your Spot —</span>
          <h2 className="text-white font-black mb-4" style={{ fontFamily:"'Bebas Neue','Impact',sans-serif", fontSize:"clamp(2.8rem,6vw,5rem)" }}>
            BOOK YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">ADVENTURE</span>
          </h2>
          <p className="text-stone-400 text-lg" style={{ fontFamily:"'DM Sans',sans-serif" }}>
            Choose your activity, pick a date, and we'll handle the rest.
          </p>
        </div>

        {/* ── SUCCESS SCREEN ── */}
        {submitted ? (
          <div className="max-w-lg mx-auto text-center bg-stone-900 border border-cyan-500/30 rounded-3xl p-12">
            <div className="w-20 h-20 rounded-full bg-cyan-500/10 border-2 border-cyan-500/40 flex items-center justify-center text-4xl mx-auto mb-6">✅</div>
            <h3 className="text-white font-black text-3xl mb-3" style={{ fontFamily:"'Bebas Neue','Impact',sans-serif" }}>BOOKING RECEIVED!</h3>
            <p className="text-stone-400 mb-2" style={{ fontFamily:"'DM Sans',sans-serif" }}>
              Thanks, <strong className="text-white">{form.name}</strong>! We'll contact you shortly to confirm.
            </p>
            <div className="bg-stone-800 rounded-xl p-5 text-left mt-6 space-y-2">
              <p className="text-stone-300 text-sm">🏄 <strong>Activity:</strong> {form.activity}</p>
              <p className="text-stone-300 text-sm">📅 <strong>Date:</strong> {form.date?.toLocaleDateString("en-GB",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
              <p className="text-stone-300 text-sm">⏱ <strong>Time:</strong> {form.slot}</p>
              <p className="text-stone-300 text-sm">👥 <strong>Guests:</strong> {form.guests}</p>
              {priceEst && <p className="text-stone-300 text-sm">💰 <strong>Estimated Total:</strong> LKR {priceEst.toLocaleString()}</p>}
            </div>
            <p className="text-stone-500 text-xs mt-5" style={{ fontFamily:"'DM Sans',sans-serif" }}>
              Confirmation will be sent to <span className="text-cyan-400">{form.email}</span>
            </p>
            <button onClick={resetForm} className="mt-8 px-6 py-3 border border-stone-700 hover:border-cyan-500/40 text-stone-400 hover:text-cyan-400 text-sm font-bold tracking-widest uppercase rounded-full transition-all" style={{ fontFamily:"'Syne',sans-serif" }}>
              Book Another
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8">

            {/* ── LEFT COLUMN ── */}
            <div className="lg:col-span-3 space-y-5">

              {/* Step 1 — Personal Details */}
              <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6">
                <h3 className="text-white font-black text-lg mb-5 flex items-center gap-2" style={{ fontFamily:"'Syne',sans-serif" }}>
                  <span className="w-7 h-7 rounded-full bg-cyan-500 text-stone-950 text-xs flex items-center justify-center font-black">1</span>
                  Personal Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <input className={inputClass("name")} placeholder="Full Name" value={form.name} onChange={e=>set("name",e.target.value)} style={{ fontFamily:"'DM Sans',sans-serif" }} />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <input className={inputClass("email")} placeholder="Email Address" type="email" value={form.email} onChange={e=>set("email",e.target.value)} style={{ fontFamily:"'DM Sans',sans-serif" }} />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <input className={inputClass("phone")} placeholder="Phone Number" type="tel" value={form.phone} onChange={e=>set("phone",e.target.value)} style={{ fontFamily:"'DM Sans',sans-serif" }} />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <select className={inputClass("guests")} value={form.guests} onChange={e=>set("guests",e.target.value)} style={{ fontFamily:"'DM Sans',sans-serif" }}>
                      {[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n} {n===1?"Guest":"Guests"}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2 — Choose Activity */}
              <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6">
                <h3 className="text-white font-black text-lg mb-5 flex items-center gap-2" style={{ fontFamily:"'Syne',sans-serif" }}>
                  <span className="w-7 h-7 rounded-full bg-cyan-500 text-stone-950 text-xs flex items-center justify-center font-black">2</span>
                  Choose Activity
                </h3>
                {loadingData ? (
                  <div className="grid sm:grid-cols-2 gap-2">
                    {[...Array(6)].map((_,i)=><div key={i} className="h-14 bg-stone-800 rounded-xl animate-pulse"/>)}
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-2">
                    {activities.map(act=>(
                      <button
                        key={act._id}
                        onClick={()=>set("activity",act.title)}
                        className={`text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150 ${form.activity===act.title?"bg-cyan-500/10 border-cyan-500/60 text-cyan-400":"bg-stone-900 border-stone-700 text-stone-400 hover:border-stone-600 hover:text-stone-300"}`}
                        style={{ fontFamily:"'DM Sans',sans-serif" }}
                      >
                        <span className="font-semibold block">{act.title}</span>
                        <span className="text-xs opacity-70">{act.duration} · LKR {act.price?.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                )}
                {errors.activity && <p className="text-red-400 text-xs mt-2">{errors.activity}</p>}
              </div>

              {/* Step 4 — Time Slot */}
              <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6">
                <h3 className="text-white font-black text-lg mb-5 flex items-center gap-2" style={{ fontFamily:"'Syne',sans-serif" }}>
                  <span className="w-7 h-7 rounded-full bg-cyan-500 text-stone-950 text-xs flex items-center justify-center font-black">4</span>
                  Select Time Slot
                </h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {slotOptions.map(slot=>(
                    <button
                      key={slot}
                      onClick={()=>set("slot",slot)}
                      className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all duration-150 ${form.slot===slot?"bg-cyan-500/10 border-cyan-500/60 text-cyan-400":"bg-stone-900 border-stone-700 text-stone-400 hover:border-stone-600 hover:text-stone-300"}`}
                      style={{ fontFamily:"'DM Sans',sans-serif" }}
                    >
                      {slot.split(" ")[0]}
                      <span className="block text-xs opacity-70">{slot.split("(")[1]?.replace(")","")}</span>
                    </button>
                  ))}
                </div>
                {errors.slot && <p className="text-red-400 text-xs mt-2">{errors.slot}</p>}
              </div>

              {/* Step 5 — Special Requests */}
              <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6">
                <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2" style={{ fontFamily:"'Syne',sans-serif" }}>
                  <span className="w-7 h-7 rounded-full bg-stone-700 text-stone-400 text-xs flex items-center justify-center font-black">5</span>
                  Special Requests <span className="text-stone-600 text-sm font-normal">(optional)</span>
                </h3>
                <textarea
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-stone-200 text-sm placeholder-stone-600 focus:outline-none focus:border-cyan-500/60 transition-colors resize-none"
                  placeholder="Health considerations, dietary needs, group details..."
                  rows={3}
                  value={form.message}
                  onChange={e=>set("message",e.target.value)}
                  style={{ fontFamily:"'DM Sans',sans-serif" }}
                />
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Step 3 — Calendar */}
              <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6">
                <h3 className="text-white font-black text-lg mb-5 flex items-center gap-2" style={{ fontFamily:"'Syne',sans-serif" }}>
                  <span className="w-7 h-7 rounded-full bg-cyan-500 text-stone-950 text-xs flex items-center justify-center font-black">3</span>
                  Pick a Date
                </h3>
                <MiniCalendar
                  selected={form.date}
                  onSelect={d=>set("date",d)}
                  minDate={today}
                  blockedDates={blockedDates}
                />
                {form.date && (
                  <p className="text-cyan-400 text-sm font-semibold mt-3 text-center" style={{ fontFamily:"'DM Sans',sans-serif" }}>
                    📅 {form.date.toLocaleDateString("en-GB",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
                  </p>
                )}
                {errors.date && <p className="text-red-400 text-xs mt-2 text-center">{errors.date}</p>}
              </div>

              {/* Summary + Submit */}
              <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6">
                <h3 className="text-white font-black text-lg mb-4" style={{ fontFamily:"'Syne',sans-serif" }}>Summary</h3>
                <div className="space-y-3 text-sm" style={{ fontFamily:"'DM Sans',sans-serif" }}>
                  {[
                    { label:"Activity", value:form.activity||"—" },
                    { label:"Date",     value:form.date?form.date.toLocaleDateString("en-GB"):"—" },
                    { label:"Time",     value:form.slot?form.slot.split(" ")[0]:"—" },
                    { label:"Guests",   value:form.guests },
                  ].map(item=>(
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-stone-800 last:border-0">
                      <span className="text-stone-500">{item.label}</span>
                      <span className="text-stone-200 font-semibold text-right max-w-[60%] truncate">{item.value}</span>
                    </div>
                  ))}

                  {priceEst && (
                    <div className="mt-4 pt-3 border-t border-stone-700">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400">Estimated Total</span>
                        <span className="text-cyan-400 font-black text-xl" style={{ fontFamily:"'Syne',sans-serif" }}>
                          LKR {priceEst.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-stone-600 text-xs mt-1">*Final price confirmed at booking</p>
                    </div>
                  )}
                </div>

                {/* API error */}
                {submitError && (
                  <div className="mt-4 flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">
                    <span className="text-red-400 flex-shrink-0">⚠️</span>
                    <p className="text-red-400 text-xs" style={{ fontFamily:"'DM Sans',sans-serif" }}>{submitError}</p>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="mt-6 w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 disabled:from-stone-700 disabled:to-stone-700 disabled:cursor-not-allowed text-stone-950 disabled:text-stone-500 font-black text-sm tracking-widest uppercase rounded-xl transition-all shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] disabled:shadow-none disabled:hover:scale-100"
                  style={{ fontFamily:"'Syne',sans-serif" }}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Submitting...
                    </span>
                  ) : "Confirm Booking →"}
                </button>
                <p className="text-stone-600 text-xs text-center mt-3" style={{ fontFamily:"'DM Sans',sans-serif" }}>
                  No payment required · We'll contact you to confirm
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
