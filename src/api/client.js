// ─── Base config ──────────────────────────────────────────────────────────────
// frontend .env:  VITE_API_URL=http://localhost:5000
export const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

// Image URL helper — filename → full URL
export const imgUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith("http")) return filename;
  return `${API_BASE}/uploads/${filename}`;
};

// ─── Token helpers ────────────────────────────────────────────────────────────
const TOKEN_KEY = "adminToken";
export const getToken    = ()      => localStorage.getItem(TOKEN_KEY);
export const setToken    = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = ()      => localStorage.removeItem(TOKEN_KEY);

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
export async function request(path, options = {}) {
  const token = getToken();

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    removeToken();
    window.location.href = "/admin/login";
    return;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
}

const get   = (path)       => request(path);
const post  = (path, body) => request(path, { method: "POST",   body: body instanceof FormData ? body : JSON.stringify(body) });
const put   = (path, body) => request(path, { method: "PUT",    body: body instanceof FormData ? body : JSON.stringify(body) });
const patch = (path, body) => request(path, { method: "PATCH",  body: JSON.stringify(body) });
const del   = (path)       => request(path, { method: "DELETE" });

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login:          (username, password) => post("/api/auth/login", { username, password }),
  me:             ()                   => get("/api/auth/me"),
  changePassword: (currentPassword, newPassword) => put("/api/auth/change-password", { currentPassword, newPassword }),
};

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────
export const bookingsApi = {
  submit: (data) => post("/api/bookings", data),

  getAll: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null))
    ).toString();
    return get(`/api/bookings/admin${qs ? "?" + qs : ""}`);
  },

  getStats:     ()          => get("/api/bookings/admin/stats"),
  updateStatus: (id, status) => patch(`/api/bookings/admin/${id}/status`, { status }),
  delete:       (id)         => del(`/api/bookings/admin/${id}`),
};

// ─── ACTIVITIES ───────────────────────────────────────────────────────────────
export const activitiesApi = {
  getAll:      ()           => get("/api/activities"),
  adminGetAll: ()           => get("/api/activities/admin/all"),
  create:      (formData)   => post("/api/activities/admin", formData),
  update:      (id, formData) => put(`/api/activities/admin/${id}`, formData),
  toggle:      (id)         => patch(`/api/activities/admin/${id}/toggle`, {}),
  delete:      (id)         => del(`/api/activities/admin/${id}`),
};

// ─── REVIEWS ──────────────────────────────────────────────────────────────────
export const reviewsApi = {
  getApproved: () => get("/api/reviews"),
  submit:      (data) => post("/api/reviews", data),

  adminGetAll: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return get(`/api/reviews/admin${qs ? "?" + qs : ""}`);
  },

  updateStatus: (id, status) => patch(`/api/reviews/admin/${id}/status`, { status }),
  delete:       (id)          => del(`/api/reviews/admin/${id}`),
};

// ─── SCHEDULE ─────────────────────────────────────────────────────────────────
export const scheduleApi = {
  getSlots:        ()             => get("/api/schedule/slots"),
  getBlocked:      ()             => get("/api/schedule/blocked"),
  adminGetSlots:   ()             => get("/api/schedule/admin/slots"),
  toggleSlot:      (id)           => patch(`/api/schedule/admin/slots/${id}/toggle`, {}),
  adminGetBlocked: ()             => get("/api/schedule/admin/blocked"),
  addBlocked:      (date, reason) => post("/api/schedule/admin/blocked", { date, reason }),
  removeBlocked:   (date)         => del(`/api/schedule/admin/blocked/${date}`),
};
