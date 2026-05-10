import { useState, useEffect } from "react";
import { getReviews, updateReviewStatus, deleteReview } from "../store/mockData";

const STATUS_STYLE = {
  approved: "bg-green-500/10 border-green-500/25 text-green-400",
  pending:  "bg-amber-500/10 border-amber-500/25 text-amber-400",
  hidden:   "bg-stone-700/30 border-stone-700/40 text-stone-500",
};

function Stars({ rating }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= rating ? "text-amber-400" : "text-stone-700"}>★</span>
      ))}
    </span>
  );
}

function ReviewCard({ r, onStatus, onDelete }) {
  const [delConfirm, setDelConfirm] = useState(false);

  const handleDel = () => {
    if (delConfirm) onDelete(r.id);
    else {
      setDelConfirm(true);
      setTimeout(() => setDelConfirm(false), 3000);
    }
  };

  return (
    <div className={`bg-stone-900 border rounded-2xl p-5 transition-all ${r.status === "hidden" ? "border-stone-800/40 opacity-60" : "border-stone-800"}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-stone-950 font-black text-sm flex-shrink-0">
            {r.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <p className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>{r.name}</p>
            <p className="text-stone-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>{r.location} · {r.date}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex-shrink-0 ${STATUS_STYLE[r.status]}`} style={{ fontFamily: "'Syne', sans-serif" }}>
          {r.status}
        </span>
      </div>

      {/* Stars + activity */}
      <div className="flex items-center gap-3 mb-2">
        <Stars rating={r.rating} />
        <span className="text-stone-600 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>{r.activity}</span>
      </div>

      {/* Text */}
      <p className="text-stone-300 text-sm leading-relaxed mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        "{r.text}"
      </p>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-3 border-t border-stone-800">
        {r.status !== "approved" && (
          <button
            onClick={() => onStatus(r.id, "approved")}
            className="px-3 py-1.5 bg-green-500/10 border border-green-500/25 text-green-400 rounded-lg text-xs font-bold hover:bg-green-500/20 transition-colors"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >✓ Approve</button>
        )}
        {r.status !== "hidden" && (
          <button
            onClick={() => onStatus(r.id, "hidden")}
            className="px-3 py-1.5 bg-stone-700/30 border border-stone-700/40 text-stone-500 rounded-lg text-xs font-bold hover:bg-stone-700/50 transition-colors"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >👁 Hide</button>
        )}
        {r.status !== "pending" && (
          <button
            onClick={() => onStatus(r.id, "pending")}
            className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/25 text-amber-400 rounded-lg text-xs font-bold hover:bg-amber-500/20 transition-colors"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >⏳ Set Pending</button>
        )}
        <button
          onClick={handleDel}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ml-auto ${
            delConfirm
              ? "bg-red-500/30 border-red-500/50 text-red-300"
              : "bg-stone-800 border-stone-700 text-stone-500 hover:text-red-400 hover:border-red-500/30"
          }`}
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {delConfirm ? "⚠️ Confirm Delete" : "🗑 Delete"}
        </button>
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter]   = useState("all");
  const [sort, setSort]       = useState("date");

  useEffect(() => {
    setReviews(getReviews());
  }, []);

  const handleStatus = (id, status) => {
    const updated = updateReviewStatus(id, status);
    setReviews(updated);
  };

  const handleDelete = (id) => {
    const updated = deleteReview(id);
    setReviews(updated);
  };

  const counts = {
    all:      reviews.length,
    pending:  reviews.filter(r => r.status === "pending").length,
    approved: reviews.filter(r => r.status === "approved").length,
    hidden:   reviews.filter(r => r.status === "hidden").length,
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  const filtered = reviews
    .filter(r => filter === "all" || r.status === filter)
    .sort((a, b) => {
      if (sort === "date")   return b.date.localeCompare(a.date);
      if (sort === "rating") return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="max-w-5xl space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Avg Rating",   value: avgRating, icon: "⭐", sub: `${reviews.length} reviews total` },
          { label: "Pending",      value: counts.pending,  icon: "⏳", sub: "Needs review"    },
          { label: "Approved",     value: counts.approved, icon: "✅", sub: "Showing on site" },
          { label: "Hidden",       value: counts.hidden,   icon: "🙈", sub: "Not displayed"   },
        ].map(s => (
          <div key={s.label} className="bg-stone-900 border border-stone-800 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-white font-black text-2xl" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>{s.value}</div>
            <div className="text-stone-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Pending alert */}
      {counts.pending > 0 && (
        <div
          className="bg-amber-500/10 border border-amber-500/25 rounded-2xl px-5 py-4 flex items-center gap-3 cursor-pointer hover:bg-amber-500/15 transition-colors"
          onClick={() => setFilter("pending")}
        >
          <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
          <p className="text-amber-300 text-sm font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <strong>{counts.pending} review{counts.pending > 1 ? "s" : ""}</strong> pending moderation — click to review
          </p>
        </div>
      )}

      {/* Filters + sort */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded-xl p-1">
          {Object.entries(counts).map(([s, c]) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filter === s ? "bg-stone-700 text-white" : "text-stone-500 hover:text-stone-300"
              }`}
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {s} ({c})
            </button>
          ))}
        </div>

        <select
          className="ml-auto bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-300 text-xs focus:outline-none"
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          <option value="date">Sort: Newest</option>
          <option value="rating">Sort: Rating</option>
          <option value="name">Sort: Name</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 py-16 text-center text-stone-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            No reviews in this category
          </div>
        ) : (
          filtered.map(r => (
            <ReviewCard key={r.id} r={r} onStatus={handleStatus} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
}
