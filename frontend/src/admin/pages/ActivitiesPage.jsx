import { useState, useEffect, useRef } from "react";
import { activitiesApi, imgUrl } from "../../api/client";

// ─── Tag options ──────────────────────────────────────────────────────────────
const TAG_OPTIONS = [
  "Most Popular","Thrilling","Family Friendly","Beginner Friendly",
  "Relaxing","Extreme","Brave","Nature","Best Value","Family",
];

// ─── New Activity Modal ───────────────────────────────────────────────────────
function NewActivityModal({ onClose, onCreated }) {
  const fileRef = useRef();
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");
  const [preview,  setPreview]  = useState(null);
  const [imageFile,setImageFile]= useState(null);

  const [draft, setDraft] = useState({
    title: "", location: "", duration: "", price: "",
    tag: "Most Popular", minAge: "6", maxGuests: "20", active: true,
  });

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCreate = async () => {
    if (!draft.title.trim() || !draft.price) { setError("Title and price are required."); return; }
    setSaving(true); setError("");
    try {
      const fd = new FormData();
      Object.entries(draft).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);
      const res = await activitiesApi.create(fd);
      onCreated(res.data);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create activity.");
      setSaving(false);
    }
  };

  const inputCls = "w-full bg-stone-800 border border-stone-700 focus:border-cyan-500/60 rounded-xl px-4 py-2.5 text-stone-200 text-sm placeholder-stone-600 outline-none transition-all";

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-2xl bg-stone-900 border border-stone-700 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-stone-800">
          <div>
            <h2 className="text-white font-black text-xl" style={{ fontFamily:"'Syne',sans-serif" }}>New Activity</h2>
            <p className="text-stone-500 text-xs mt-0.5" style={{ fontFamily:"'DM Sans',sans-serif" }}>Fill in the details below to add a new activity.</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors text-lg">✕</button>
        </div>

        <div className="px-7 py-6 max-h-[75vh] overflow-y-auto">
          <div className="grid sm:grid-cols-2 gap-5">

            {/* Image upload */}
            <div className="sm:col-span-2">
              <label className="text-stone-500 text-xs font-bold tracking-widest uppercase block mb-2" style={{ fontFamily:"'Syne',sans-serif" }}>Activity Image</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="relative h-40 rounded-2xl border-2 border-dashed border-stone-700 hover:border-cyan-500/50 bg-stone-800/40 hover:bg-stone-800/60 cursor-pointer overflow-hidden transition-all group"
              >
                {preview ? (
                  <>
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <p className="text-white text-sm font-bold">Click to change</p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2">
                    <span className="text-4xl">📷</span>
                    <p className="text-stone-500 text-sm" style={{ fontFamily:"'DM Sans',sans-serif" }}>Click to upload image</p>
                    <p className="text-stone-700 text-xs">JPEG, PNG, WebP · Max 5 MB</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
            </div>

            {/* Title */}
            <div className="sm:col-span-2">
              <label className="text-stone-500 text-xs font-bold tracking-widest uppercase block mb-2" style={{ fontFamily:"'Syne',sans-serif" }}>Activity Title *</label>
              <input className={inputCls} placeholder="e.g. White Water Rafting" value={draft.title} onChange={e=>set("title",e.target.value)} style={{ fontFamily:"'DM Sans',sans-serif" }} />
            </div>

            {/* Location */}
            <div>
              <label className="text-stone-500 text-xs font-bold tracking-widest uppercase block mb-2" style={{ fontFamily:"'Syne',sans-serif" }}>Location</label>
              <input className={inputCls} placeholder="e.g. Kelani River" value={draft.location} onChange={e=>set("location",e.target.value)} style={{ fontFamily:"'DM Sans',sans-serif" }} />
            </div>

            {/* Duration */}
            <div>
              <label className="text-stone-500 text-xs font-bold tracking-widest uppercase block mb-2" style={{ fontFamily:"'Syne',sans-serif" }}>Duration</label>
              <input className={inputCls} placeholder="e.g. 1 – 2 Hours" value={draft.duration} onChange={e=>set("duration",e.target.value)} style={{ fontFamily:"'DM Sans',sans-serif" }} />
            </div>

            {/* Price */}
            <div>
              <label className="text-stone-500 text-xs font-bold tracking-widest uppercase block mb-2" style={{ fontFamily:"'Syne',sans-serif" }}>Price (LKR) *</label>
              <input className={inputCls} type="number" placeholder="3500" value={draft.price} onChange={e=>set("price",e.target.value)} style={{ fontFamily:"'DM Sans',sans-serif" }} />
            </div>

            {/* Tag */}
            <div>
              <label className="text-stone-500 text-xs font-bold tracking-widest uppercase block mb-2" style={{ fontFamily:"'Syne',sans-serif" }}>Badge Tag</label>
              <select className={inputCls} value={draft.tag} onChange={e=>set("tag",e.target.value)} style={{ fontFamily:"'DM Sans',sans-serif" }}>
                {TAG_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Min Age */}
            <div>
              <label className="text-stone-500 text-xs font-bold tracking-widest uppercase block mb-2" style={{ fontFamily:"'Syne',sans-serif" }}>Minimum Age</label>
              <input className={inputCls} type="number" min="1" placeholder="6" value={draft.minAge} onChange={e=>set("minAge",e.target.value)} style={{ fontFamily:"'DM Sans',sans-serif" }} />
            </div>

            {/* Max Guests */}
            <div>
              <label className="text-stone-500 text-xs font-bold tracking-widest uppercase block mb-2" style={{ fontFamily:"'Syne',sans-serif" }}>Max Guests</label>
              <input className={inputCls} type="number" min="1" placeholder="20" value={draft.maxGuests} onChange={e=>set("maxGuests",e.target.value)} style={{ fontFamily:"'DM Sans',sans-serif" }} />
            </div>

            {/* Active toggle */}
            <div className="sm:col-span-2 flex items-center justify-between bg-stone-800/50 border border-stone-700 rounded-xl px-4 py-3">
              <div>
                <p className="text-stone-200 font-semibold text-sm" style={{ fontFamily:"'Syne',sans-serif" }}>Active on public site</p>
                <p className="text-stone-500 text-xs mt-0.5" style={{ fontFamily:"'DM Sans',sans-serif" }}>Visible to customers when enabled</p>
              </div>
              <button
                onClick={() => set("active", !draft.active)}
                className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${draft.active ? "bg-cyan-500" : "bg-stone-600"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${draft.active ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">
              <span className="text-red-400">⚠️</span>
              <p className="text-red-400 text-sm" style={{ fontFamily:"'DM Sans',sans-serif" }}>{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-7 py-5 border-t border-stone-800">
          <button onClick={onClose} className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 font-bold text-sm rounded-xl transition-colors" style={{ fontFamily:"'Syne',sans-serif" }}>
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={saving}
            className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 disabled:from-stone-700 disabled:to-stone-700 text-stone-950 disabled:text-stone-500 font-black text-sm tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-cyan-500/20 disabled:shadow-none"
            style={{ fontFamily:"'Syne',sans-serif" }}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                Creating...
              </span>
            ) : "Create Activity →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Activity Card ────────────────────────────────────────────────────────────
function ActivityCard({ act, onToggle, onSave, onDelete }) {
  const [editing,   setEditing]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [draft,     setDraft]     = useState({ ...act });
  const [imageFile, setImageFile] = useState(null);
  const [preview,   setPreview]   = useState(null);
  const fileRef = useRef();

  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title",     draft.title);
      fd.append("price",     draft.price);
      fd.append("duration",  draft.duration);
      fd.append("location",  draft.location);
      fd.append("tag",       draft.tag);
      fd.append("minAge",    draft.minAge);
      fd.append("maxGuests", draft.maxGuests);
      if (imageFile) fd.append("image", imageFile);
      await onSave(act._id, fd);
      setEditing(false);
      setImageFile(null);
      setPreview(null);
    } finally { setSaving(false); }
  };

  const displayImage = preview || imgUrl(act.image);

  return (
    <div className={`bg-stone-900 border rounded-2xl overflow-hidden transition-all duration-200 ${act.active ? "border-stone-800" : "border-stone-800/40 opacity-60"}`}>
      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        {displayImage
          ? <img src={displayImage} alt={act.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-stone-800 flex items-center justify-center text-stone-600 text-3xl">🏄</div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="bg-cyan-500/90 text-stone-950 text-xs font-black px-2.5 py-1 rounded-full" style={{ fontFamily:"'Syne',sans-serif" }}>{act.tag}</span>
        </div>
        <div className="absolute top-3 right-3 flex gap-1">
          {editing && (
            <button onClick={() => fileRef.current?.click()} className="px-2 py-1 bg-stone-900/80 border border-stone-600 text-stone-300 rounded-full text-xs font-bold hover:border-cyan-500/50 hover:text-cyan-400 transition-colors">📷</button>
          )}
          <button
            onClick={() => onToggle(act._id)}
            className={`px-3 py-1 rounded-full text-xs font-black border transition-all ${act.active?"bg-green-500/20 border-green-500/40 text-green-400 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400":"bg-red-500/20 border-red-500/40 text-red-400 hover:bg-green-500/20 hover:border-green-500/40 hover:text-green-400"}`}
          >
            {act.active ? "Active" : "Inactive"}
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
      </div>

      {/* Content */}
      <div className="p-4">
        {editing ? (
          <div className="space-y-3">
            <input className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 text-sm focus:outline-none focus:border-cyan-500/50" value={draft.title} onChange={e=>setDraft(d=>({...d,title:e.target.value}))} placeholder="Title" />
            <div className="grid grid-cols-2 gap-2">
              {[["price","Price (LKR)","number"],["duration","Duration","text"],["minAge","Min Age","number"],["maxGuests","Max Guests","number"]].map(([k,label,type])=>(
                <div key={k}>
                  <label className="text-stone-600 text-xs mb-1 block" style={{ fontFamily:"'Syne',sans-serif" }}>{label}</label>
                  <input type={type} className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 text-sm focus:outline-none focus:border-cyan-500/50" value={draft[k]} onChange={e=>setDraft(d=>({...d,[k]:e.target.value}))} />
                </div>
              ))}
            </div>
            <input className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 text-sm focus:outline-none focus:border-cyan-500/50" value={draft.location} onChange={e=>setDraft(d=>({...d,location:e.target.value}))} placeholder="Location" />
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 rounded-lg text-xs font-black hover:bg-cyan-500/25 disabled:opacity-50">
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button onClick={() => { setDraft({...act}); setEditing(false); setPreview(null); setImageFile(null); }} className="px-4 py-2 bg-stone-800 border border-stone-700 text-stone-400 rounded-lg text-xs font-bold">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-white font-black text-sm leading-tight" style={{ fontFamily:"'Syne',sans-serif" }}>{act.title}</h3>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setEditing(true)} className="text-stone-600 hover:text-cyan-400 transition-colors text-sm" title="Edit">✏️</button>
                <button onClick={() => onDelete(act._id)} className="text-stone-600 hover:text-red-400 transition-colors text-sm" title="Delete">🗑</button>
              </div>
            </div>
            <div className="space-y-1 text-xs text-stone-500 mb-3" style={{ fontFamily:"'DM Sans',sans-serif" }}>
              <p>📍 {act.location}</p>
              <p>⏱ {act.duration}</p>
              <p>👶 Min age: {act.minAge} · 👥 Max: {act.maxGuests}</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-stone-800">
              <span className="text-cyan-400 font-black text-lg" style={{ fontFamily:"'Syne',sans-serif" }}>LKR {act.price?.toLocaleString()}</span>
              <span className="text-stone-600 text-xs">per person</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [filter,   setFilter]   = useState("all");
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [showNew,  setShowNew]  = useState(false);

  const load = async () => {
    try {
      const res = await activitiesApi.adminGetAll();
      setActivities(res.data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (id) => {
    try { await activitiesApi.toggle(id); load(); }
    catch (err) { setError(err.message); }
  };

  const handleSave = async (id, formData) => {
    try { await activitiesApi.update(id, formData); load(); }
    catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this activity? This cannot be undone.")) return;
    try { await activitiesApi.delete(id); load(); }
    catch (err) { setError(err.message); }
  };

  const handleCreated = (newActivity) => {
    setActivities(prev => [newActivity, ...prev]);
  };

  const filtered = activities.filter(a =>
    filter === "all" ? true : filter === "active" ? a.active : !a.active
  );

  return (
    <div className="max-w-7xl space-y-5">
      {/* Modal */}
      {showNew && <NewActivityModal onClose={() => setShowNew(false)} onCreated={handleCreated} />}

      {error && <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-4 text-red-400 text-sm">{error}</div>}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded-xl p-1">
            {[["all","All"],["active","Active"],["inactive","Inactive"]].map(([val,label])=>(
              <button key={val} onClick={()=>setFilter(val)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter===val?"bg-stone-700 text-white":"text-stone-500 hover:text-stone-300"}`} style={{ fontFamily:"'Syne',sans-serif" }}>{label}</button>
            ))}
          </div>
          {/* Counts */}
          <div className="flex gap-3 text-sm">
            <span className="flex items-center gap-1.5 text-stone-400" style={{ fontFamily:"'DM Sans',sans-serif" }}><span className="w-2 h-2 rounded-full bg-green-500"/>{activities.filter(a=>a.active).length} active</span>
            <span className="flex items-center gap-1.5 text-stone-400" style={{ fontFamily:"'DM Sans',sans-serif" }}><span className="w-2 h-2 rounded-full bg-stone-600"/>{activities.filter(a=>!a.active).length} inactive</span>
          </div>
        </div>

        {/* New Activity button */}
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-stone-950 font-black text-sm tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-[1.02]"
          style={{ fontFamily:"'Syne',sans-serif" }}
        >
          <span className="text-lg leading-none">+</span> New Activity
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <svg className="animate-spin w-8 h-8 text-cyan-500" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-stone-600 text-lg mb-4" style={{ fontFamily:"'DM Sans',sans-serif" }}>No activities found</p>
          <button onClick={() => setShowNew(true)} className="px-5 py-2.5 bg-stone-800 border border-stone-700 text-stone-300 rounded-xl text-sm font-bold hover:border-cyan-500/40 hover:text-cyan-400 transition-all" style={{ fontFamily:"'Syne',sans-serif" }}>
            + Add the first activity
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(act => (
            <ActivityCard key={act._id} act={act} onToggle={handleToggle} onSave={handleSave} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
