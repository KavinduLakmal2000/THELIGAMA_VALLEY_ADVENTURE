import { useState, useEffect } from "react";
import { activitiesApi, scheduleApi, bookingsApi } from "../api/client";

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function MiniCalendar({ selected, onSelect, minDate, blockedDates=[] }) {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(selected ? selected.getFullYear() : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected ? selected.getMonth()    : today.getMonth());

  const prev = () => { if(viewMonth===0){setViewMonth(11);setViewYear(y=>y-1);}else setViewMonth(m=>m-1); };
  const next = () => { if(viewMonth===11){setViewMonth(0);setViewYear(y=>y+1);}else setViewMonth(m=>m+1); };
  const pad  = n => String(n).padStart(2,"0");

  const isDisabled = d => { const dt=new Date(viewYear,viewMonth,d); if(minDate&&dt<minDate)return true; return blockedDates.includes(`${viewYear}-${pad(viewMonth+1)}-${pad(d)}`); };
  const isBlocked  = d => blockedDates.includes(`${viewYear}-${pad(viewMonth+1)}-${pad(d)}`);
  const isSelected = d => selected && selected.getDate()===d && selected.getMonth()===viewMonth && selected.getFullYear()===viewYear;
  const isToday    = d => today.getDate()===d && today.getMonth()===viewMonth && today.getFullYear()===viewYear;

  const cells = [];
  for(let i=0;i<new Date(viewYear,viewMonth,1).getDay();i++) cells.push(null);
  for(let d=1;d<=new Date(viewYear,viewMonth+1,0).getDate();d++) cells.push(d);

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors">‹</button>
        <span className="text-stone-900 font-black text-sm" style={{ fontFamily:"'Syne',sans-serif" }}>{MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button onClick={next} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors">›</button>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES.map(d=><div key={d} className="text-center text-stone-400 text-xs font-bold py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day,i)=>(
          <div key={i} className="flex justify-center">
            {day ? (
              <button onClick={()=>!isDisabled(day)&&onSelect(new Date(viewYear,viewMonth,day))} disabled={isDisabled(day)} title={isBlocked(day)?"Unavailable":""}
                className={`w-8 h-8 rounded-full text-sm font-semibold transition-all ${
                  isSelected(day) ? "bg-cyan-500 text-white font-black shadow-md shadow-cyan-200"
                  : isBlocked(day) ? "bg-red-50 text-red-300 cursor-not-allowed line-through"
                  : isDisabled(day) ? "text-stone-300 cursor-not-allowed"
                  : isToday(day) ? "border-2 border-cyan-500 text-cyan-600"
                  : "text-stone-700 hover:bg-stone-100"
                }`}>{day}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Booking() {
  const today = new Date(); today.setHours(0,0,0,0);

  const [activities,   setActivities]   = useState([]);
  const [activeSlots,  setActiveSlots]  = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [loadingData,  setLoadingData]  = useState(true);

  const [form,        setForm]        = useState({ name:"", email:"", phone:"", activity:"", guests:"1", slot:"", date:null, message:"" });
  const [errors,      setErrors]      = useState({});
  const [submitting,  setSubmitting]  = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted,   setSubmitted]   = useState(false);

  useEffect(() => {
    Promise.all([activitiesApi.getAll(), scheduleApi.getSlots(), scheduleApi.getBlocked()])
      .then(([acts,slots,blocked]) => { setActivities(acts.data); setActiveSlots(slots.data); setBlockedDates(blocked.data.map(b=>b.date)); })
      .catch(()=>{}).finally(()=>setLoadingData(false));
  }, []);

  const set = (k,v) => { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:undefined})); setSubmitError(""); };

  const validate = () => {
    const e={};
    if(!form.name.trim())  e.name="Name is required";
    if(!form.email.trim()||!/\S+@\S+\.\S+/.test(form.email)) e.email="Valid email required";
    if(!form.phone.trim()) e.phone="Phone is required";
    if(!form.activity)     e.activity="Please select an activity";
    if(!form.date)         e.date="Please select a date";
    if(!form.slot)         e.slot="Please select a time slot";
    return e;
  };

  const handleSubmit = async () => {
    const e=validate(); if(Object.keys(e).length){setErrors(e);return;}
    setSubmitting(true); setSubmitError("");
    try {
      const act   = activities.find(a=>a.title===form.activity);
      const total = act ? act.price * parseInt(form.guests) : 0;
      await bookingsApi.submit({ name:form.name.trim(), email:form.email.trim(), phone:form.phone.trim(), activity:form.activity, date:form.date.toISOString().split("T")[0], slot:form.slot.split(" ")[0], guests:parseInt(form.guests), total, message:form.message.trim() });
      setSubmitted(true);
    } catch(err) { setSubmitError(err.message||"Something went wrong."); }
    finally { setSubmitting(false); }
  };

  const resetForm = () => { setSubmitted(false); setForm({name:"",email:"",phone:"",activity:"",guests:"1",slot:"",date:null,message:""}); setErrors({}); setSubmitError(""); };

  const inputClass = field => `w-full bg-white border ${errors[field]?"border-red-400":"border-stone-300"} rounded-xl px-4 py-3 text-stone-800 text-sm placeholder-stone-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-100 transition-colors shadow-sm`;
  const slotOptions = activeSlots.length>0 ? activeSlots.map(s=>`${s.label} (${s.time})`) : ["Morning (8:00 AM – 11:00 AM)","Midday (11:30 AM – 2:30 PM)","Afternoon (3:00 PM – 5:00 PM)"];
  const selectedAct = activities.find(a=>a.title===form.activity);
  const priceEst    = selectedAct ? selectedAct.price * parseInt(form.guests||1) : null;

  return (
    <section id="booking" className="bg-white py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(6,182,212,0.04)_0%,_transparent_60%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block text-cyan-600 text-xs font-bold tracking-[0.35em] uppercase mb-4" style={{ fontFamily:"'Syne',sans-serif" }}>— Reserve Your Spot —</span>
          <h2 className="text-stone-900 font-black mb-4" style={{ fontFamily:"'Bebas Neue','Impact',sans-serif", fontSize:"clamp(2.8rem,6vw,5rem)" }}>
            BOOK YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">ADVENTURE</span>
          </h2>
          <p className="text-stone-500 text-lg" style={{ fontFamily:"'DM Sans',sans-serif" }}>Choose your activity, pick a date, and we'll handle the rest.</p>
        </div>

        {submitted ? (
          <div className="max-w-lg mx-auto text-center bg-white border border-stone-200 rounded-3xl p-12 shadow-xl shadow-stone-100">
            <div className="w-20 h-20 rounded-full bg-cyan-50 border-2 border-cyan-200 flex items-center justify-center text-4xl mx-auto mb-6">✅</div>
            <h3 className="text-stone-900 font-black text-3xl mb-3" style={{ fontFamily:"'Bebas Neue','Impact',sans-serif" }}>BOOKING RECEIVED!</h3>
            <p className="text-stone-500 mb-2" style={{ fontFamily:"'DM Sans',sans-serif" }}>Thanks, <strong className="text-stone-900">{form.name}</strong>! We'll contact you shortly.</p>
            <div className="bg-stone-50 rounded-xl p-5 text-left mt-6 space-y-2 border border-stone-100">
              {[["🏄","Activity",form.activity],["📅","Date",form.date?.toLocaleDateString("en-GB",{weekday:"long",year:"numeric",month:"long",day:"numeric"})],["⏱","Time",form.slot],["👥","Guests",form.guests]].map(([e,l,v])=>(
                <p key={l} className="text-stone-700 text-sm">{e} <strong>{l}:</strong> {v}</p>
              ))}
              {priceEst && <p className="text-stone-700 text-sm">💰 <strong>Estimated:</strong> LKR {priceEst.toLocaleString()}</p>}
            </div>
            <p className="text-stone-400 text-xs mt-5">Confirmation sent to <span className="text-cyan-600">{form.email}</span></p>
            <button onClick={resetForm} className="mt-8 px-6 py-3 border border-stone-200 hover:border-cyan-400 text-stone-500 hover:text-cyan-600 text-sm font-bold tracking-widest uppercase rounded-full transition-all" style={{ fontFamily:"'Syne',sans-serif" }}>Book Another</button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-5">

              {/* Step 1 */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
                <h3 className="text-stone-900 font-black text-lg mb-5 flex items-center gap-2" style={{ fontFamily:"'Syne',sans-serif" }}>
                  <span className="w-7 h-7 rounded-full bg-cyan-500 text-white text-xs flex items-center justify-center font-black">1</span> Personal Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[["name","Full Name","text"],["email","Email Address","email"],["phone","Phone Number","tel"]].map(([k,ph,t])=>(
                    <div key={k}>
                      <input className={inputClass(k)} placeholder={ph} type={t} value={form[k]} onChange={e=>set(k,e.target.value)} style={{ fontFamily:"'DM Sans',sans-serif" }} />
                      {errors[k] && <p className="text-red-500 text-xs mt-1">{errors[k]}</p>}
                    </div>
                  ))}
                  <div>
                    <select className={inputClass("guests")} value={form.guests} onChange={e=>set("guests",e.target.value)} style={{ fontFamily:"'DM Sans',sans-serif" }}>
                      {[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n} {n===1?"Guest":"Guests"}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
                <h3 className="text-stone-900 font-black text-lg mb-5 flex items-center gap-2" style={{ fontFamily:"'Syne',sans-serif" }}>
                  <span className="w-7 h-7 rounded-full bg-cyan-500 text-white text-xs flex items-center justify-center font-black">2</span> Choose Activity
                </h3>
                {loadingData ? (
                  <div className="grid sm:grid-cols-2 gap-2">{[...Array(6)].map((_,i)=><div key={i} className="h-14 bg-stone-100 rounded-xl animate-pulse"/>)}</div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-2">
                    {activities.map(act=>(
                      <button key={act._id} onClick={()=>set("activity",act.title)}
                        className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${form.activity===act.title?"bg-cyan-50 border-cyan-400 text-cyan-700":"bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50"}`}
                        style={{ fontFamily:"'DM Sans',sans-serif" }}>
                        <span className="font-semibold block">{act.title}</span>
                        <span className="text-xs opacity-70">{act.duration} · LKR {act.price?.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                )}
                {errors.activity && <p className="text-red-500 text-xs mt-2">{errors.activity}</p>}
              </div>

              {/* Step 4 */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
                <h3 className="text-stone-900 font-black text-lg mb-5 flex items-center gap-2" style={{ fontFamily:"'Syne',sans-serif" }}>
                  <span className="w-7 h-7 rounded-full bg-cyan-500 text-white text-xs flex items-center justify-center font-black">4</span> Select Time Slot
                </h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {slotOptions.map(slot=>(
                    <button key={slot} onClick={()=>set("slot",slot)}
                      className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${form.slot===slot?"bg-cyan-50 border-cyan-400 text-cyan-700":"bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50"}`}
                      style={{ fontFamily:"'DM Sans',sans-serif" }}>
                      {slot.split(" ")[0]}
                      <span className="block text-xs opacity-70">{slot.split("(")[1]?.replace(")","")}</span>
                    </button>
                  ))}
                </div>
                {errors.slot && <p className="text-red-500 text-xs mt-2">{errors.slot}</p>}
              </div>

              {/* Step 5 */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
                <h3 className="text-stone-900 font-black text-lg mb-4 flex items-center gap-2" style={{ fontFamily:"'Syne',sans-serif" }}>
                  <span className="w-7 h-7 rounded-full bg-stone-200 text-stone-500 text-xs flex items-center justify-center font-black">5</span>
                  Special Requests <span className="text-stone-400 text-sm font-normal">(optional)</span>
                </h3>
                <textarea className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-stone-800 text-sm placeholder-stone-400 focus:outline-none focus:border-cyan-500 transition-colors resize-none shadow-sm" placeholder="Health considerations, dietary needs, group details..." rows={3} value={form.message} onChange={e=>set("message",e.target.value)} style={{ fontFamily:"'DM Sans',sans-serif" }} />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-5">
              {/* Step 3 — Calendar */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
                <h3 className="text-stone-900 font-black text-lg mb-5 flex items-center gap-2" style={{ fontFamily:"'Syne',sans-serif" }}>
                  <span className="w-7 h-7 rounded-full bg-cyan-500 text-white text-xs flex items-center justify-center font-black">3</span> Pick a Date
                </h3>
                <MiniCalendar selected={form.date} onSelect={d=>set("date",d)} minDate={today} blockedDates={blockedDates} />
                {form.date && <p className="text-cyan-600 text-sm font-semibold mt-3 text-center">📅 {form.date.toLocaleDateString("en-GB",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>}
                {errors.date && <p className="text-red-500 text-xs mt-2 text-center">{errors.date}</p>}
              </div>

              {/* Summary */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
                <h3 className="text-stone-900 font-black text-lg mb-4" style={{ fontFamily:"'Syne',sans-serif" }}>Summary</h3>
                <div className="space-y-3 text-sm" style={{ fontFamily:"'DM Sans',sans-serif" }}>
                  {[["Activity",form.activity||"—"],["Date",form.date?form.date.toLocaleDateString("en-GB"):"—"],["Time",form.slot?form.slot.split(" ")[0]:"—"],["Guests",form.guests]].map(([l,v])=>(
                    <div key={l} className="flex justify-between items-center py-2 border-b border-stone-200 last:border-0">
                      <span className="text-stone-400">{l}</span>
                      <span className="text-stone-800 font-semibold text-right max-w-[60%] truncate">{v}</span>
                    </div>
                  ))}
                  {priceEst && (
                    <div className="mt-4 pt-3 border-t border-stone-300">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-500">Estimated Total</span>
                        <span className="text-cyan-600 font-black text-xl" style={{ fontFamily:"'Syne',sans-serif" }}>LKR {priceEst.toLocaleString()}</span>
                      </div>
                      <p className="text-stone-400 text-xs mt-1">*Final price confirmed at booking</p>
                    </div>
                  )}
                </div>

                {submitError && (
                  <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <span className="text-red-500">⚠️</span>
                    <p className="text-red-600 text-xs">{submitError}</p>
                  </div>
                )}

                <button onClick={handleSubmit} disabled={submitting}
                  className="mt-6 w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 disabled:from-stone-300 disabled:to-stone-300 disabled:cursor-not-allowed text-white font-black text-sm tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-cyan-200 hover:shadow-cyan-300 hover:scale-[1.02] disabled:shadow-none disabled:hover:scale-100"
                  style={{ fontFamily:"'Syne',sans-serif" }}>
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                      Submitting...
                    </span>
                  ) : "Confirm Booking →"}
                </button>
                <p className="text-stone-400 text-xs text-center mt-3">No payment required · We'll contact you to confirm</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
