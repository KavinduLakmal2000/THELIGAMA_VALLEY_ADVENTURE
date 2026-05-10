import { useState, useEffect } from "react";
import { getActivities, updateActivity, toggleActivity } from "../store/mockData";

function ActivityCard({ act, onToggle, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...act });

  const handleSave = () => {
    onSave(act.id, {
      title: draft.title,
      price: parseInt(draft.price) || act.price,
      duration: draft.duration,
      location: draft.location,
      tag: draft.tag,
      minAge: parseInt(draft.minAge) || act.minAge,
      maxGuests: parseInt(draft.maxGuests) || act.maxGuests,
    });
    setEditing(false);
  };

  return (
    <div className={`bg-stone-900 border rounded-2xl overflow-hidden transition-all duration-200 ${act.active ? "border-stone-800" : "border-stone-800/40 opacity-60"}`}>
      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        <img src={act.image} alt={act.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="bg-cyan-500/90 text-stone-950 text-xs font-black px-2.5 py-1 rounded-full" style={{ fontFamily: "'Syne', sans-serif" }}>
            {act.tag}
          </span>
        </div>
        {/* Active toggle */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => onToggle(act.id)}
            className={`px-3 py-1 rounded-full text-xs font-black border transition-all ${
              act.active
                ? "bg-green-500/20 border-green-500/40 text-green-400 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400"
                : "bg-red-500/20 border-red-500/40 text-red-400 hover:bg-green-500/20 hover:border-green-500/40 hover:text-green-400"
            }`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {act.active ? "Active" : "Inactive"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {editing ? (
          <div className="space-y-3">
            <input
              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 text-sm focus:outline-none focus:border-cyan-500/50"
              value={draft.title}
              onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
              placeholder="Activity Name"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-stone-600 text-xs mb-1 block" style={{ fontFamily: "'Syne', sans-serif" }}>Price (LKR)</label>
                <input
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 text-sm focus:outline-none focus:border-cyan-500/50"
                  type="number"
                  value={draft.price}
                  onChange={e => setDraft(d => ({ ...d, price: e.target.value }))}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>
              <div>
                <label className="text-stone-600 text-xs mb-1 block" style={{ fontFamily: "'Syne', sans-serif" }}>Duration</label>
                <input
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 text-sm focus:outline-none focus:border-cyan-500/50"
                  value={draft.duration}
                  onChange={e => setDraft(d => ({ ...d, duration: e.target.value }))}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>
              <div>
                <label className="text-stone-600 text-xs mb-1 block" style={{ fontFamily: "'Syne', sans-serif" }}>Min Age</label>
                <input
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 text-sm focus:outline-none focus:border-cyan-500/50"
                  type="number"
                  value={draft.minAge}
                  onChange={e => setDraft(d => ({ ...d, minAge: e.target.value }))}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>
              <div>
                <label className="text-stone-600 text-xs mb-1 block" style={{ fontFamily: "'Syne', sans-serif" }}>Max Guests</label>
                <input
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 text-sm focus:outline-none focus:border-cyan-500/50"
                  type="number"
                  value={draft.maxGuests}
                  onChange={e => setDraft(d => ({ ...d, maxGuests: e.target.value }))}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>
            </div>
            <input
              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 text-sm focus:outline-none focus:border-cyan-500/50"
              value={draft.location}
              onChange={e => setDraft(d => ({ ...d, location: e.target.value }))}
              placeholder="Location"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 py-2 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 rounded-lg text-xs font-black hover:bg-cyan-500/25 transition-colors"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >Save Changes</button>
              <button
                onClick={() => { setDraft({ ...act }); setEditing(false); }}
                className="px-4 py-2 bg-stone-800 border border-stone-700 text-stone-400 rounded-lg text-xs font-bold hover:bg-stone-700 transition-colors"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-white font-black text-sm leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                {act.title}
              </h3>
              <button
                onClick={() => setEditing(true)}
                className="text-stone-600 hover:text-cyan-400 transition-colors text-xs flex-shrink-0"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >✏️ Edit</button>
            </div>

            <div className="space-y-1 text-xs text-stone-500 mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <p>📍 {act.location}</p>
              <p>⏱ {act.duration}</p>
              <p>👶 Min age: {act.minAge} · 👥 Max: {act.maxGuests}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-800">
              <span className="text-cyan-400 font-black text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>
                LKR {act.price.toLocaleString()}
              </span>
              <span className="text-stone-600 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>per person</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setActivities(getActivities());
  }, []);

  const handleToggle = (id) => {
    const updated = toggleActivity(id);
    setActivities(updated);
  };

  const handleSave = (id, patch) => {
    const updated = updateActivity(id, patch);
    setActivities(updated);
  };

  const filtered = activities.filter(a =>
    filter === "all" ? true : filter === "active" ? a.active : !a.active
  );

  const activeCount   = activities.filter(a => a.active).length;
  const inactiveCount = activities.filter(a => !a.active).length;

  return (
    <div className="max-w-7xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded-xl p-1">
            {[["all","All"], ["active","Active"], ["inactive","Inactive"]].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === val ? "bg-stone-700 text-white" : "text-stone-500 hover:text-stone-300"
                }`}
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2 text-stone-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <div className="w-2 h-2 rounded-full bg-green-500" />
            {activeCount} active
          </div>
          <div className="flex items-center gap-2 text-stone-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <div className="w-2 h-2 rounded-full bg-red-500/50" />
            {inactiveCount} inactive
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(act => (
          <ActivityCard
            key={act.id}
            act={act}
            onToggle={handleToggle}
            onSave={handleSave}
          />
        ))}
      </div>

      <p className="text-stone-600 text-xs text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        Changes are saved to localStorage and persist across page refreshes.
      </p>
    </div>
  );
}
