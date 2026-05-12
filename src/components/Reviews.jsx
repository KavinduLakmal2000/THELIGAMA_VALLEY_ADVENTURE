import { useState, useEffect } from "react";
import { reviewsApi, activitiesApi } from "../api/client";

// ─── Star Picker ──────────────────────────────────────────────────────────────
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)} 
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="text-2xl transition-transform hover:scale-110"
        >
          <span className={(hovered || value) >= n ? "text-amber-400" : "text-stone-700"}>★</span>
        </button>
      ))}
    </div>
  );
}

// ─── Submit Review Form ───────────────────────────────────────────────────────
function ReviewForm({ activities, onSubmitted }) {
  const [open, setOpen]   = useState(false);
  const [form, setForm]   = useState({ name:"", location:"", rating:0, text:"", activity:"" });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = (k, v) => { setForm(f => ({...f, [k]:v})); setErrors(e => ({...e, [k]:undefined})); setError(""); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name   = "Name is required";
    if (!form.rating)       e.rating = "Please select a rating";
    if (!form.text.trim())  e.text   = "Review text is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true); setError("");
    try {
      await reviewsApi.submit(form);
      onSubmitted();
      setOpen(false);
      setForm({ name:"", location:"", rating:0, text:"", activity:"" });
    } catch (err) {
      setError(err.message || "Submission failed. Please try again.");
    } finally { setLoading(false); }
  };

  const inputCls = (field) =>
    `w-full bg-stone-800/60 border ${errors[field]?"border-red-500/50":"border-stone-700"} focus:border-cyan-500/60 rounded-xl px-4 py-3 text-stone-200 text-sm placeholder-stone-600 outline-none transition-all`;

  if (!open) return (
    <div className="mt-16 text-center">
      <button
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-3 px-8 py-4 bg-stone-900/60 border border-stone-700 hover:border-cyan-500/50 hover:bg-stone-900 text-stone-300 hover:text-white rounded-2xl transition-all duration-200"
        style={{ fontFamily:"'Syne',sans-serif" }}
      >
        <span className="text-2xl">✍️</span>
        <span className="font-bold text-sm tracking-wider uppercase">Share Your Experience</span>
        <span className="text-stone-600 group-hover:text-cyan-400 transition-colors">→</span>
      </button>
      <p className="text-stone-600 text-xs mt-3" style={{ fontFamily:"'DM Sans',sans-serif" }}>
        Your review will appear after moderation
      </p>
    </div>
  );

  return (
    <div className="mt-16">
      {/* Form card */}
      <div className="max-w-2xl mx-auto bg-stone-900/80 border border-stone-700 rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-stone-800">
          <div>
            <h3 className="text-white font-black text-xl" style={{ fontFamily:"'Syne',sans-serif" }}>Write a Review</h3>
            <p className="text-stone-500 text-xs mt-0.5" style={{ fontFamily:"'DM Sans',sans-serif" }}>Reviews are moderated before appearing publicly</p>
          </div>
          <button onClick={() => setOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors">✕</button>
        </div>

        <div className="px-8 py-7 space-y-5">
          {/* Rating — required */}
          <div>
            <label className="text-stone-400 text-xs font-bold tracking-widest uppercase block mb-3" style={{ fontFamily:"'Syne',sans-serif" }}>
              Your Rating *
            </label>
            <StarPicker value={form.rating} onChange={v => set("rating", v)} />
            {errors.rating && <p className="text-red-400 text-xs mt-1">{errors.rating}</p>}
          </div>

          {/* Name + Location */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-stone-500 text-xs font-bold tracking-widest uppercase block mb-2" style={{ fontFamily:"'Syne',sans-serif" }}>Full Name *</label>
              <input className={inputCls("name")} placeholder="Sarah Thompson" value={form.name} onChange={e=>set("name",e.target.value)} style={{ fontFamily:"'DM Sans',sans-serif" }} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-stone-500 text-xs font-bold tracking-widest uppercase block mb-2" style={{ fontFamily:"'Syne',sans-serif" }}>Location <span className="text-stone-600 font-normal normal-case">(optional)</span></label>
              <input className={inputCls("location")} placeholder="London, UK" value={form.location} onChange={e=>set("location",e.target.value)} style={{ fontFamily:"'DM Sans',sans-serif" }} />
            </div>
          </div>

          {/* Activity picker */}
          {activities.length > 0 && (
            <div>
              <label className="text-stone-500 text-xs font-bold tracking-widest uppercase block mb-2" style={{ fontFamily:"'Syne',sans-serif" }}>Activity <span className="text-stone-600 font-normal normal-case">(optional)</span></label>
              <select className={inputCls("activity")} value={form.activity} onChange={e=>set("activity",e.target.value)} style={{ fontFamily:"'DM Sans',sans-serif" }}>
                <option value="">Select the activity you did</option>
                {activities.map(a => <option key={a._id} value={a.title}>{a.title}</option>)}
              </select>
            </div>
          )}

          {/* Review text */}
          <div>
            <label className="text-stone-500 text-xs font-bold tracking-widest uppercase block mb-2" style={{ fontFamily:"'Syne',sans-serif" }}>Your Review *</label>
            <textarea
              className={inputCls("text") + " resize-none"}
              placeholder="Tell others about your experience — what you loved, how the guides were, whether you'd recommend it..."
              rows={4}
              value={form.text}
              onChange={e=>set("text",e.target.value)}
              style={{ fontFamily:"'DM Sans',sans-serif" }}
            />
            {errors.text && <p className="text-red-400 text-xs mt-1">{errors.text}</p>}
            <p className="text-stone-700 text-xs mt-1" style={{ fontFamily:"'DM Sans',sans-serif" }}>
              {form.text.length}/500 characters
            </p>
          </div>

          {/* API error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">
              <span className="text-red-400 flex-shrink-0">⚠️</span>
              <p className="text-red-400 text-sm" style={{ fontFamily:"'DM Sans',sans-serif" }}>{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 disabled:from-stone-700 disabled:to-stone-700 disabled:cursor-not-allowed text-stone-950 disabled:text-stone-500 font-black text-sm tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-cyan-500/20 hover:scale-[1.01] disabled:hover:scale-100 disabled:shadow-none"
            style={{ fontFamily:"'Syne',sans-serif" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                Submitting...
              </span>
            ) : "Submit Review →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Thank You Banner ─────────────────────────────────────────────────────────
function ThankYou({ onReset }) {
  return (
    <div className="mt-16 max-w-md mx-auto text-center bg-stone-900 border border-cyan-500/30 rounded-3xl p-10">
      <div className="w-16 h-16 rounded-full bg-cyan-500/10 border-2 border-cyan-500/30 flex items-center justify-center text-3xl mx-auto mb-5">🎉</div>
      <h3 className="text-white font-black text-2xl mb-2" style={{ fontFamily:"'Bebas Neue','Impact',sans-serif" }}>THANK YOU!</h3>
      <p className="text-stone-400 text-sm leading-relaxed mb-6" style={{ fontFamily:"'DM Sans',sans-serif" }}>
        Your review has been submitted and will appear on the site after our team reviews it. We appreciate you sharing your experience!
      </p>
      <button onClick={onReset} className="px-6 py-2.5 border border-stone-700 hover:border-cyan-500/40 text-stone-400 hover:text-cyan-400 text-xs font-bold tracking-widest uppercase rounded-full transition-all" style={{ fontFamily:"'Syne',sans-serif" }}>
        Write Another
      </button>
    </div>
  );
}

// ─── Main Reviews Section ─────────────────────────────────────────────────────
export default function Reviews() {
  const [reviews,    setReviews]    = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [submitted,  setSubmitted]  = useState(false);

  useEffect(() => {
    Promise.all([
      reviewsApi.getApproved(),
      activitiesApi.getAll(),
    ]).then(([r, a]) => {
      setReviews(r.data);
      setActivities(a.data);
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const avgRating = reviews.length
    ? (reviews.reduce((s,r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "4.9";

  return (
    <section id="reviews" className="bg-stone-900 py-28 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-700 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-cyan-400 text-xs font-bold tracking-[0.35em] uppercase mb-4" style={{ fontFamily:"'Syne',sans-serif" }}>— Guest Experiences —</span>
          <h2 className="text-white font-black mb-6" style={{ fontFamily:"'Bebas Neue','Impact',sans-serif", fontSize:"clamp(2.8rem,6vw,5rem)" }}>
            WHAT OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">ADVENTURERS</span> SAY
          </h2>
          <p className="text-stone-400 text-lg max-w-xl mx-auto" style={{ fontFamily:"'DM Sans',sans-serif" }}>
            Hear from travelers who experienced unforgettable adventures with us in Kithulgala.
          </p>
        </div>

        {/* Review cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_,i) => (
              <div key={i} className="bg-stone-950/80 border border-stone-800 rounded-2xl p-7 animate-pulse space-y-4">
                <div className="h-3 bg-stone-800 rounded w-full"/>
                <div className="h-3 bg-stone-800 rounded w-4/5"/>
                <div className="h-3 bg-stone-800 rounded w-3/5"/>
                <div className="flex items-center gap-3 pt-4 border-t border-stone-800">
                  <div className="w-10 h-10 rounded-full bg-stone-800"/>
                  <div className="space-y-1"><div className="h-3 bg-stone-800 rounded w-24"/><div className="h-2 bg-stone-800 rounded w-16"/></div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-stone-600 text-lg" style={{ fontFamily:"'DM Sans',sans-serif" }}>
            No reviews yet — be the first!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map(review => (
              <div key={review._id} className="group relative bg-stone-950/80 border border-stone-800 hover:border-cyan-500/30 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10">
                <div className="text-cyan-500/20 font-black leading-none mb-4 select-none" style={{ fontFamily:"'Georgia',serif", fontSize:"5rem", lineHeight:0.8 }}>"</div>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_,j) => <span key={j} className={j < review.rating ? "text-amber-400" : "text-stone-700"}>★</span>)}
                </div>
                <p className="text-stone-300 text-sm leading-relaxed mb-6" style={{ fontFamily:"'DM Sans',sans-serif" }}>{review.text}</p>
                <div className="flex items-center gap-3 pt-5 border-t border-stone-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-stone-950 font-black text-sm flex-shrink-0">
                    {review.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                  </div>
                  <div>
                    <p className="text-white font-black text-sm" style={{ fontFamily:"'Syne',sans-serif" }}>{review.name}</p>
                    <p className="text-stone-500 text-xs" style={{ fontFamily:"'DM Sans',sans-serif" }}>
                      {review.location}{review.activity ? ` · ${review.activity}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Overall rating bar */}
        {!loading && reviews.length > 0 && (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 bg-stone-950/60 border border-stone-800 rounded-2xl px-8 py-5">
              <div>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300" style={{ fontFamily:"'Bebas Neue','Impact',sans-serif" }}>{avgRating}</div>
                <div className="flex gap-0.5 mt-1">{[...Array(5)].map((_,i)=><span key={i} className="text-amber-400">★</span>)}</div>
              </div>
              <div className="w-px h-12 bg-stone-700"/>
              <div className="text-left">
                <p className="text-white font-black text-lg" style={{ fontFamily:"'Syne',sans-serif" }}>Overall Rating</p>
                <p className="text-stone-400 text-sm" style={{ fontFamily:"'DM Sans',sans-serif" }}>Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit form / thank you */}
        {submitted
          ? <ThankYou onReset={() => setSubmitted(false)} />
          : <ReviewForm activities={activities} onSubmitted={() => setSubmitted(true)} />
        }
      </div>
    </section>
  );
}
