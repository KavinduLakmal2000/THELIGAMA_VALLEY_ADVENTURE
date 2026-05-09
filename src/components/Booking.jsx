import { useState } from "react";
import { activities } from "../data/data";

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function MiniCalendar({ selected, onSelect, minDate }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(selected ? selected.getFullYear() : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected ? selected.getMonth() : today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isDisabled = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    return minDate && d < minDate;
  };

  const isSelected = (day) => {
    if (!selected) return false;
    return selected.getDate() === day && selected.getMonth() === viewMonth && selected.getFullYear() === viewYear;
  };

  const isToday = (day) => {
    return today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear;
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-stone-900 border border-stone-700 rounded-2xl p-5">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
        >
          ‹
        </button>
        <span
          className="text-white font-black text-sm tracking-wider"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
        >
          ›
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-stone-600 text-xs font-bold py-1" style={{ fontFamily: "'Syne', sans-serif" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => (
          <div key={i} className="flex justify-center">
            {day ? (
              <button
                onClick={() => !isDisabled(day) && onSelect(new Date(viewYear, viewMonth, day))}
                disabled={isDisabled(day)}
                className={`w-8 h-8 rounded-full text-sm font-semibold transition-all duration-150 ${
                  isSelected(day)
                    ? "bg-cyan-500 text-stone-950 font-black shadow-lg shadow-cyan-500/30"
                    : isToday(day)
                    ? "border border-cyan-500/50 text-cyan-400"
                    : isDisabled(day)
                    ? "text-stone-700 cursor-not-allowed"
                    : "text-stone-300 hover:bg-stone-700 hover:text-white"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {day}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Booking() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    activity: "",
    guests: "1",
    slot: "",
    date: null,
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const slots = ["Morning (8:00 AM – 11:00 AM)", "Midday (11:30 AM – 2:30 PM)", "Afternoon (3:00 PM – 5:00 PM)"];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.activity) e.activity = "Please select an activity";
    if (!form.date) e.date = "Please select a date";
    if (!form.slot) e.slot = "Please select a time slot";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitted(true);
  };

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  const inputClass = (field) =>
    `w-full bg-stone-900 border ${errors[field] ? "border-red-500/60" : "border-stone-700"} rounded-xl px-4 py-3 text-stone-200 text-sm placeholder-stone-600 focus:outline-none focus:border-cyan-500/60 focus:bg-stone-900 transition-colors`;

  return (
    <section id="booking" className="bg-stone-950 py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(6,182,212,0.07)_0%,_transparent_60%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block text-cyan-400 text-xs font-bold tracking-[0.35em] uppercase mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            — Reserve Your Spot —
          </span>
          <h2
            className="text-white font-black mb-4"
            style={{
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
            }}
          >
            BOOK YOUR{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
              ADVENTURE
            </span>
          </h2>
          <p className="text-stone-400 text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Choose your activity, pick a date, and we'll handle the rest.
          </p>
        </div>

        {submitted ? (
          /* Success */
          <div className="max-w-lg mx-auto text-center bg-stone-900 border border-cyan-500/30 rounded-3xl p-12">
            <div className="w-20 h-20 rounded-full bg-cyan-500/10 border-2 border-cyan-500/40 flex items-center justify-center text-4xl mx-auto mb-6">
              ✅
            </div>
            <h3
              className="text-white font-black text-3xl mb-3"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
            >
              BOOKING CONFIRMED!
            </h3>
            <p className="text-stone-400 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Thanks, <strong className="text-white">{form.name}</strong>! Your adventure is booked.
            </p>
            <div className="bg-stone-800 rounded-xl p-5 text-left mt-6 space-y-2">
              <p className="text-stone-300 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                🏄 <strong>Activity:</strong> {form.activity}
              </p>
              <p className="text-stone-300 text-sm">
                📅 <strong>Date:</strong>{" "}
                {form.date?.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
              <p className="text-stone-300 text-sm">⏱ <strong>Time:</strong> {form.slot}</p>
              <p className="text-stone-300 text-sm">👥 <strong>Guests:</strong> {form.guests}</p>
            </div>
            <p className="text-stone-500 text-xs mt-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              A confirmation will be sent to <span className="text-cyan-400">{form.email}</span>
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name:"",email:"",phone:"",activity:"",guests:"1",slot:"",date:null,message:"" }); }}
              className="mt-8 px-6 py-3 border border-stone-700 hover:border-cyan-500/40 text-stone-400 hover:text-cyan-400 text-sm font-bold tracking-widest uppercase rounded-full transition-all"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Book Another
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form — left 3 cols */}
            <div className="lg:col-span-3 space-y-5">
              {/* Personal info */}
              <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6">
                <h3
                  className="text-white font-black text-lg mb-5 flex items-center gap-2"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <span className="w-7 h-7 rounded-full bg-cyan-500 text-stone-950 text-xs flex items-center justify-center font-black">1</span>
                  Personal Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      className={inputClass("name")}
                      placeholder="Full Name"
                      value={form.name}
                      onChange={e => set("name", e.target.value)}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <input
                      className={inputClass("email")}
                      placeholder="Email Address"
                      type="email"
                      value={form.email}
                      onChange={e => set("email", e.target.value)}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <input
                      className={inputClass("phone")}
                      placeholder="Phone Number"
                      type="tel"
                      value={form.phone}
                      onChange={e => set("phone", e.target.value)}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <select
                      className={inputClass("guests")}
                      value={form.guests}
                      onChange={e => set("guests", e.target.value)}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Activity select */}
              <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6">
                <h3
                  className="text-white font-black text-lg mb-5 flex items-center gap-2"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <span className="w-7 h-7 rounded-full bg-cyan-500 text-stone-950 text-xs flex items-center justify-center font-black">2</span>
                  Choose Activity
                </h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {activities.map((act) => (
                    <button
                      key={act.id}
                      onClick={() => set("activity", act.title)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150 ${
                        form.activity === act.title
                          ? "bg-cyan-500/10 border-cyan-500/60 text-cyan-400"
                          : "bg-stone-900 border-stone-700 text-stone-400 hover:border-stone-600 hover:text-stone-300"
                      }`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <span className="font-semibold block">{act.title}</span>
                      <span className="text-xs opacity-70">{act.duration} · {act.price}</span>
                    </button>
                  ))}
                </div>
                {errors.activity && <p className="text-red-400 text-xs mt-2">{errors.activity}</p>}
              </div>

              {/* Time slot */}
              <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6">
                <h3
                  className="text-white font-black text-lg mb-5 flex items-center gap-2"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <span className="w-7 h-7 rounded-full bg-cyan-500 text-stone-950 text-xs flex items-center justify-center font-black">4</span>
                  Select Time Slot
                </h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => set("slot", slot)}
                      className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all duration-150 ${
                        form.slot === slot
                          ? "bg-cyan-500/10 border-cyan-500/60 text-cyan-400"
                          : "bg-stone-900 border-stone-700 text-stone-400 hover:border-stone-600 hover:text-stone-300"
                      }`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {slot.split(" ")[0]}
                      <span className="block text-xs opacity-70">{slot.split("(")[1]?.replace(")", "")}</span>
                    </button>
                  ))}
                </div>
                {errors.slot && <p className="text-red-400 text-xs mt-2">{errors.slot}</p>}
              </div>

              {/* Message */}
              <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6">
                <h3
                  className="text-white font-black text-lg mb-4 flex items-center gap-2"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <span className="w-7 h-7 rounded-full bg-stone-700 text-stone-400 text-xs flex items-center justify-center font-black">5</span>
                  Special Requests <span className="text-stone-600 text-sm font-normal">(optional)</span>
                </h3>
                <textarea
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-stone-200 text-sm placeholder-stone-600 focus:outline-none focus:border-cyan-500/60 transition-colors resize-none"
                  placeholder="Any special requirements, health considerations, or questions..."
                  rows={3}
                  value={form.message}
                  onChange={e => set("message", e.target.value)}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>
            </div>

            {/* Right — calendar + summary */}
            <div className="lg:col-span-2 space-y-5">
              {/* Calendar */}
              <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6">
                <h3
                  className="text-white font-black text-lg mb-5 flex items-center gap-2"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <span className="w-7 h-7 rounded-full bg-cyan-500 text-stone-950 text-xs flex items-center justify-center font-black">3</span>
                  Pick a Date
                </h3>
                <MiniCalendar
                  selected={form.date}
                  onSelect={(d) => set("date", d)}
                  minDate={today}
                />
                {form.date && (
                  <p className="text-cyan-400 text-sm font-semibold mt-3 text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    📅 {form.date.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  </p>
                )}
                {errors.date && <p className="text-red-400 text-xs mt-2 text-center">{errors.date}</p>}
              </div>

              {/* Booking summary */}
              <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6">
                <h3
                  className="text-white font-black text-lg mb-4"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Summary
                </h3>
                <div className="space-y-3 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {[
                    { label: "Activity", value: form.activity || "—" },
                    { label: "Date", value: form.date ? form.date.toLocaleDateString("en-GB") : "—" },
                    { label: "Time", value: form.slot ? form.slot.split(" ")[0] : "—" },
                    { label: "Guests", value: form.guests },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-stone-800 last:border-0">
                      <span className="text-stone-500">{item.label}</span>
                      <span className="text-stone-200 font-semibold text-right max-w-[60%] truncate">{item.value}</span>
                    </div>
                  ))}

                  {/* Price estimate */}
                  {form.activity && form.guests && (
                    <div className="mt-4 pt-3 border-t border-stone-700">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400">Estimated Total</span>
                        <span
                          className="text-cyan-400 font-black text-xl"
                          style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                          {(() => {
                            const act = activities.find(a => a.title === form.activity);
                            if (!act) return "—";
                            const price = parseInt(act.price.replace(/[^0-9]/g, ""));
                            return `LKR ${(price * parseInt(form.guests)).toLocaleString()}`;
                          })()}
                        </span>
                      </div>
                      <p className="text-stone-600 text-xs mt-1">*Final price confirmed at booking</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  className="mt-6 w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-stone-950 font-black text-sm tracking-widest uppercase rounded-xl transition-all duration-200 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02]"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Confirm Booking →
                </button>
                <p className="text-stone-600 text-xs text-center mt-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  No payment required now · We'll contact you to confirm
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
