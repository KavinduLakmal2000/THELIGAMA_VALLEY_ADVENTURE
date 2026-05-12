// ─── SEED DATA ────────────────────────────────────────────────────────────────
// All data persists to localStorage. On first load, seed data is written.

const KEYS = {
  bookings: "kithulgala_bookings",
  activities: "kithulgala_activities",
  reviews: "kithulgala_reviews",
  blockedDates: "kithulgala_blocked_dates",
  slots: "kithulgala_slots",
};

// ── Seed bookings ─────────────────────────────────────────────────────────────
const seedBookings = [
  { id: "BK001", name: "Daniel Perera",    email: "daniel@example.com",  phone: "+94771234567", activity: "White Water Rafting",   date: "2026-05-12", slot: "Morning",   guests: 3, status: "confirmed",  total: 10500, message: "",                           createdAt: "2026-05-01" },
  { id: "BK002", name: "Sarah Thompson",   email: "sarah@example.com",   phone: "+447700900123", activity: "Canyoning Adventure",  date: "2026-05-12", slot: "Midday",    guests: 2, status: "pending",    total: 8000,  message: "First time, please be patient!", createdAt: "2026-05-02" },
  { id: "BK003", name: "Arjun Patel",      email: "arjun@example.com",   phone: "+919876543210", activity: "Zip Lining",           date: "2026-05-13", slot: "Morning",   guests: 4, status: "confirmed",  total: 10000, message: "",                           createdAt: "2026-05-02" },
  { id: "BK004", name: "Emily Rodriguez",  email: "emily@example.com",   phone: "+34612345678",  activity: "Adventure Day Out",    date: "2026-05-14", slot: "Morning",   guests: 2, status: "pending",    total: 16000, message: "Vegetarian lunch please",    createdAt: "2026-05-03" },
  { id: "BK005", name: "Michael Brown",    email: "michael@example.com", phone: "+61412345678",  activity: "Riverside Camping",    date: "2026-05-15", slot: "Afternoon", guests: 5, status: "confirmed",  total: 32500, message: "",                           createdAt: "2026-05-03" },
  { id: "BK006", name: "Nadia Silva",      email: "nadia@example.com",   phone: "+94712345678",  activity: "Kayaking",             date: "2026-05-16", slot: "Midday",    guests: 2, status: "cancelled",  total: 5600,  message: "Cancelled due to weather",   createdAt: "2026-05-04" },
  { id: "BK007", name: "Kenji Tanaka",     email: "kenji@example.com",   phone: "+819012345678", activity: "Waterfall Abseiling",  date: "2026-05-17", slot: "Morning",   guests: 3, status: "confirmed",  total: 13500, message: "",                           createdAt: "2026-05-04" },
  { id: "BK008", name: "Priya Sharma",     email: "priya@example.com",   phone: "+917654321098", activity: "Jungle Trekking",      date: "2026-05-18", slot: "Morning",   guests: 6, status: "completed",  total: 13200, message: "Group of colleagues",        createdAt: "2026-05-01" },
  { id: "BK009", name: "Lucas Dubois",     email: "lucas@example.com",   phone: "+33612345678",  activity: "Confidence Jump",      date: "2026-05-19", slot: "Afternoon", guests: 1, status: "pending",    total: 1800,  message: "",                           createdAt: "2026-05-05" },
  { id: "BK010", name: "Amara Osei",       email: "amara@example.com",   phone: "+233201234567", activity: "Family Adventure Packages", date: "2026-05-20", slot: "Morning", guests: 4, status: "confirmed", total: 48000, message: "Kids aged 8 and 11",       createdAt: "2026-05-05" },
  { id: "BK011", name: "Tom Hughes",       email: "tom@example.com",     phone: "+447911123456", activity: "White Water Rafting",   date: "2026-05-21", slot: "Midday",    guests: 2, status: "pending",    total: 7000,  message: "",                           createdAt: "2026-05-06" },
  { id: "BK012", name: "Fatima Al-Rashid", email: "fatima@example.com",  phone: "+97150123456",  activity: "Adventure Day Out",    date: "2026-05-22", slot: "Morning",   guests: 3, status: "confirmed",  total: 24000, message: "No alcohol please",          createdAt: "2026-05-06" },
];

// ── Seed activities ───────────────────────────────────────────────────────────
const seedActivities = [
  { id: 1,  title: "White Water Rafting",       location: "Kelani River",       duration: "1 – 2 Hours",       price: 3500, tag: "Most Popular",    active: true,  minAge: 12, maxGuests: 12, image: "https://images.unsplash.com/photo-1530866495561-7b4ceec6d988?w=600&q=80" },
  { id: 2,  title: "Canyoning Adventure",       location: "Rainforest Streams", duration: "2 – 3 Hours",       price: 4000, tag: "Thrilling",       active: true,  minAge: 14, maxGuests: 10, image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80" },
  { id: 3,  title: "Zip Lining",                location: "Forest Canopy",      duration: "30 Minutes",        price: 2500, tag: "Family Friendly", active: true,  minAge: 8,  maxGuests: 20, image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&q=80" },
  { id: 4,  title: "Kayaking",                  location: "Calm River Waters",  duration: "1 – 2 Hours",       price: 2800, tag: "Beginner",        active: true,  minAge: 10, maxGuests: 8,  image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80" },
  { id: 5,  title: "Riverside Camping",         location: "Kelani River Bank",  duration: "Overnight",         price: 6500, tag: "Relaxing",        active: true,  minAge: 6,  maxGuests: 30, image: "https://images.unsplash.com/photo-1478827387698-1527781a4887?w=600&q=80" },
  { id: 6,  title: "Waterfall Abseiling",       location: "Natural Waterfalls", duration: "1 – 2 Hours",       price: 4500, tag: "Extreme",         active: true,  minAge: 16, maxGuests: 8,  image: "https://images.unsplash.com/photo-1544551763-92ab472cad5d?w=600&q=80" },
  { id: 7,  title: "Confidence Jump",           location: "Natural Rock Pools", duration: "30 Minutes",        price: 1800, tag: "Brave",           active: true,  minAge: 12, maxGuests: 15, image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80" },
  { id: 8,  title: "Jungle Trekking",           location: "Rainforest Trails",  duration: "2 – 4 Hours",       price: 2200, tag: "Nature",          active: true,  minAge: 8,  maxGuests: 20, image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80" },
  { id: 9,  title: "Adventure Day Out",         location: "Multiple Activities",duration: "Full Day",          price: 8000, tag: "Best Value",      active: true,  minAge: 10, maxGuests: 15, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80" },
  { id: 10, title: "Family Adventure Packages", location: "All Locations",      duration: "Flexible Duration", price: 12000,tag: "Family",          active: true,  minAge: 6,  maxGuests: 25, image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&q=80" },
];

// ── Seed reviews ──────────────────────────────────────────────────────────────
const seedReviews = [
  { id: 1, name: "Daniel Perera",   location: "Colombo, Sri Lanka", rating: 5, text: "Amazing white water rafting experience! The guides were very professional and safety was well maintained throughout the trip.", status: "approved",  activity: "White Water Rafting",   date: "2026-04-28" },
  { id: 2, name: "Sarah Thompson",  location: "United Kingdom",     rating: 5, text: "One of the best adventure experiences in Sri Lanka! The rafting was thrilling and the scenery was absolutely beautiful.", status: "approved",  activity: "White Water Rafting",   date: "2026-04-30" },
  { id: 3, name: "Arjun Patel",     location: "India",              rating: 4, text: "Great adventure and friendly staff. The canyoning and confidence jump were my favorite parts of the trip!", status: "approved",  activity: "Canyoning Adventure",  date: "2026-05-01" },
  { id: 4, name: "Emily Rodriguez", location: "Spain",              rating: 5, text: "Fantastic team and well-organized activities. Perfect for beginners and families looking for a safe adventure.", status: "approved",  activity: "Adventure Day Out",    date: "2026-05-02" },
  { id: 5, name: "Michael Brown",   location: "Australia",          rating: 5, text: "Unforgettable experience! The guides were knowledgeable and fun. Highly recommended for anyone visiting Sri Lanka.", status: "approved",  activity: "Riverside Camping",    date: "2026-05-03" },
  { id: 6, name: "Kenji Tanaka",    location: "Japan",              rating: 3, text: "Good experience but the wait time was long. Could improve the scheduling system.", status: "pending",   activity: "Zip Lining",           date: "2026-05-07" },
  { id: 7, name: "Priya Sharma",    location: "India",              rating: 5, text: "Absolutely loved the jungle trekking! Our guide was incredible, knew every plant and bird. Will definitely come back.", status: "pending",   activity: "Jungle Trekking",      date: "2026-05-08" },
  { id: 8, name: "Lucas Dubois",    location: "France",             rating: 2, text: "Not well organized. We waited 2 hours with no explanation. The activity itself was fine though.", status: "pending",   activity: "Confidence Jump",      date: "2026-05-09" },
];

// ── Seed slots config ─────────────────────────────────────────────────────────
const seedSlots = [
  { id: "morning",   label: "Morning",   time: "8:00 AM – 11:00 AM",  active: true },
  { id: "midday",    label: "Midday",    time: "11:30 AM – 2:30 PM",  active: true },
  { id: "afternoon", label: "Afternoon", time: "3:00 PM – 5:00 PM",   active: true },
];

// ── Seed blocked dates ────────────────────────────────────────────────────────
const seedBlockedDates = [
  { date: "2026-05-25", reason: "Public Holiday" },
  { date: "2026-06-01", reason: "Maintenance Day" },
];

// ─── STORAGE API ──────────────────────────────────────────────────────────────
function load(key, seed) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  } catch {
    return seed;
  }
}

function save(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

// Bookings
export function getBookings() { return load(KEYS.bookings, seedBookings); }
export function saveBookings(data) { save(KEYS.bookings, data); }

export function updateBookingStatus(id, status) {
  const bookings = getBookings().map(b => b.id === id ? { ...b, status } : b);
  saveBookings(bookings);
  return bookings;
}

export function deleteBooking(id) {
  const bookings = getBookings().filter(b => b.id !== id);
  saveBookings(bookings);
  return bookings;
}

export function addBooking(booking) {
  const bookings = getBookings();
  const newBooking = {
    ...booking,
    id: "BK" + String(bookings.length + 1).padStart(3, "0"),
    createdAt: new Date().toISOString().split("T")[0],
    status: "pending",
  };
  const updated = [newBooking, ...bookings];
  saveBookings(updated);
  return updated;
}

// Activities
export function getActivities() { return load(KEYS.activities, seedActivities); }
export function saveActivities(data) { save(KEYS.activities, data); }

export function updateActivity(id, patch) {
  const activities = getActivities().map(a => a.id === id ? { ...a, ...patch } : a);
  saveActivities(activities);
  return activities;
}

export function toggleActivity(id) {
  const activities = getActivities().map(a => a.id === id ? { ...a, active: !a.active } : a);
  saveActivities(activities);
  return activities;
}

// Reviews
export function getReviews() { return load(KEYS.reviews, seedReviews); }
export function saveReviews(data) { save(KEYS.reviews, data); }

export function updateReviewStatus(id, status) {
  const reviews = getReviews().map(r => r.id === id ? { ...r, status } : r);
  saveReviews(reviews);
  return reviews;
}

export function deleteReview(id) {
  const reviews = getReviews().filter(r => r.id !== id);
  saveReviews(reviews);
  return reviews;
}

// Slots
export function getSlots() { return load(KEYS.slots, seedSlots); }
export function saveSlots(data) { save(KEYS.slots, data); }

export function toggleSlot(id) {
  const slots = getSlots().map(s => s.id === id ? { ...s, active: !s.active } : s);
  saveSlots(slots);
  return slots;
}

// Blocked dates
export function getBlockedDates() { return load(KEYS.blockedDates, seedBlockedDates); }
export function saveBlockedDates(data) { save(KEYS.blockedDates, data); }

export function addBlockedDate(entry) {
  const dates = [...getBlockedDates(), entry];
  saveBlockedDates(dates);
  return dates;
}

export function removeBlockedDate(date) {
  const dates = getBlockedDates().filter(d => d.date !== date);
  saveBlockedDates(dates);
  return dates;
}

// ─── STATS ────────────────────────────────────────────────────────────────────
export function getDashboardStats() {
  const bookings = getBookings();
  const today = new Date().toISOString().split("T")[0];

  const todayBookings = bookings.filter(b => b.date === today);
  const pending = bookings.filter(b => b.status === "pending");
  const confirmed = bookings.filter(b => b.status === "confirmed");
  const totalRevenue = bookings
    .filter(b => b.status !== "cancelled")
    .reduce((sum, b) => sum + (b.total || 0), 0);

  // Revenue by month (last 6 months)
  const monthRevenue = {};
  bookings.forEach(b => {
    if (b.status === "cancelled") return;
    const month = b.date?.slice(0, 7);
    if (month) monthRevenue[month] = (monthRevenue[month] || 0) + (b.total || 0);
  });

  // Activity popularity
  const activityCount = {};
  bookings.forEach(b => {
    activityCount[b.activity] = (activityCount[b.activity] || 0) + 1;
  });

  // Upcoming (next 7 days)
  const upcoming = bookings
    .filter(b => b.date >= today && b.status !== "cancelled")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return {
    total: bookings.length,
    todayCount: todayBookings.length,
    pendingCount: pending.length,
    confirmedCount: confirmed.length,
    totalRevenue,
    monthRevenue,
    activityCount,
    upcoming,
  };
}

export function resetAllData() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}
