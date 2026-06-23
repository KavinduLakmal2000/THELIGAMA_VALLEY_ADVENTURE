# KithulGala Adventures — Full Stack Documentation

A complete reference for the KithulGala River Adventures platform: React + Tailwind frontend and Node.js + Express + MongoDB backend.

---

## Table of Contents

1. [Frontend](#frontend)
   - [Quick Start](#frontend-quick-start)
   - [Project Structure](#frontend-project-structure)
   - [Design System](#design-system)
   - [Editing Content](#editing-content)
   - [Booking & Calendar](#booking--calendar)
   - [Hero Video](#hero-video)
2. [Backend](#backend)
   - [Quick Start](#backend-quick-start)
   - [Security Layers](#security-layers)
   - [Project Structure](#backend-project-structure)
   - [API Reference](#api-reference)
   - [Connecting the Frontend](#connecting-the-frontend)
   - [Environment Variables](#environment-variables)
   - [Deployment](#deployment)

---

## Frontend

A full-featured React frontend for KithulGala River Adventures, built with Vite + React 18 + Tailwind CSS v3.

### Frontend Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Add your hero video
#    Drop your video file into the /public folder as:
#    public/hero_vid.mp4

# 3. Start dev server
npm run dev

# 4. Build for production
npm run build
```

### Frontend Project Structure

```
kithulgala-rafting/
├── public/
│   └── hero_vid.mp4          ← Drop your video here
├── src/
│   ├── data/
│   │   └── data.js           ← ALL site content lives here
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Activities.jsx
│   │   ├── Schedule.jsx
│   │   ├── Reviews.jsx
│   │   ├── Guidelines.jsx
│   │   ├── Booking.jsx       ← Calendar + booking form
│   │   ├── Contact.jsx
│   │   └── Footer.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

### Design System

| Token | Value |
|---|---|
| **Font — Display** | Bebas Neue (headings) |
| **Font — UI** | Syne (labels, nav, badges) |
| **Font — Body** | DM Sans (paragraphs) |
| **Primary accent** | Cyan-500 `#06b6d4` |
| **Secondary accent** | Teal-500 `#14b8a6` |
| **Background** | Stone-950 / Stone-900 |

### Editing Content

All text, images, pricing, reviews, and schedule data lives in `src/data/data.js`. No need to hunt through component files — change it once, it updates everywhere.

### Booking & Calendar

The `Booking.jsx` component includes:
- A fully custom mini-calendar (no external dependency)
- Activity picker with pricing
- Time slot selection
- Guest count + price estimation
- Form validation
- Booking confirmation screen

### Hero Video

Place your video at `public/hero_vid.mp4`. It will autoplay muted and loop as the hero background. Supported formats: `.mp4`, `.webm`. Recommended resolution: 1920×1080.

---

## Backend

Node.js + Express + MongoDB REST API with JWT auth and image uploads.

### Backend Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
#    → Edit .env: set MONGO_URI and a strong JWT_SECRET

# 3. Seed the database (run ONCE)
npm run seed
#    Creates the admin account + default time slots

# 4. Start the dev server
npm run dev
#    Runs on http://localhost:5000

# 5. Start the frontend (separate terminal)
cd ../rafting_frontend && npm run dev
```

### Security Layers

| Layer | What it does |
|---|---|
| **Helmet** | Sets secure HTTP headers |
| **CORS** | Only allows your frontend origin (`CLIENT_ORIGIN` in `.env`) |
| **Rate limiting** | 10 login attempts / 15 min · 300 API requests / 15 min |
| **Mongo Sanitize** | Strips `$` and `.` from request bodies (NoSQL injection) |
| **bcrypt** | Admin password hashed with cost factor 12 |
| **JWT** | Stateless token, 7-day expiry, verified on every protected request |
| **Multer filter** | Only JPEG/PNG/WebP accepted; max 5 MB |
| **Body limit** | JSON body capped at 10 KB |

### Backend Project Structure

```
backend/
├── server.js              ← entry point, security middleware, route wiring
├── .env                   ← your secrets (never commit this)
├── .env.example           ← template
├── uploads/               ← uploaded images (git-ignored at runtime)
├── middleware/
│   ├── auth.js            ← JWT protect() middleware
│   ├── upload.js          ← Multer config
│   └── errorHandler.js    ← global error handler
├── models/
│   ├── Admin.js           ← bcrypt hashed password, matchPassword()
│   ├── Booking.js
│   ├── Activity.js        ← includes image filename field
│   ├── Review.js
│   └── Schedule.js        ← Slot + BlockedDate models
├── routes/
│   ├── auth.js
│   ├── bookings.js
│   ├── activities.js
│   ├── reviews.js
│   └── schedule.js
└── scripts/
    └── seedAdmin.js       ← run once: node scripts/seedAdmin.js
```

### API Reference

#### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | — | Login → returns JWT |
| GET  | `/api/auth/me` | ✅ | Verify token, get admin info |
| PUT  | `/api/auth/change-password` | ✅ | Change admin password |

**Login body:**
```json
{ "username": "admin", "password": "kithulgala2025" }
```

**Login response:**
```json
{ "success": true, "token": "eyJ...", "admin": { "id": "...", "username": "admin" } }
```

---

#### Bookings

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST   | `/api/bookings` | — | Public: submit booking |
| GET    | `/api/bookings/admin` | ✅ | List all (filterable) |
| GET    | `/api/bookings/admin/stats` | ✅ | Dashboard stats |
| GET    | `/api/bookings/admin/:id` | ✅ | Single booking |
| PATCH  | `/api/bookings/admin/:id/status` | ✅ | Update status |
| DELETE | `/api/bookings/admin/:id` | ✅ | Delete booking |

**Query params for `GET /admin`:**
`?status=pending&activity=Kayaking&search=daniel&sort=date&order=asc&page=1&limit=20`

---

#### Activities

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET    | `/api/activities` | — | Public: active activities |
| GET    | `/api/activities/:id` | — | Public: single activity |
| GET    | `/api/activities/admin/all` | ✅ | All (incl. inactive) |
| POST   | `/api/activities/admin` | ✅ | Create + upload image |
| PUT    | `/api/activities/admin/:id` | ✅ | Update + optional new image |
| PATCH  | `/api/activities/admin/:id/toggle` | ✅ | Toggle active |
| DELETE | `/api/activities/admin/:id` | ✅ | Delete + removes image file |

**Image upload:** send as `multipart/form-data` with field name `image`.  
Image URL after upload: `http://localhost:5000/uploads/<filename>`

---

#### Reviews

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET    | `/api/reviews` | — | Public: approved only |
| POST   | `/api/reviews` | — | Public: submit review |
| GET    | `/api/reviews/admin` | ✅ | All reviews |
| PATCH  | `/api/reviews/admin/:id/status` | ✅ | approve / hide / pending |
| DELETE | `/api/reviews/admin/:id` | ✅ | Delete review |

---

#### Schedule

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET    | `/api/schedule/slots` | — | Public: active slots |
| GET    | `/api/schedule/blocked` | — | Public: blocked dates |
| GET    | `/api/schedule/admin/slots` | ✅ | All slots |
| PATCH  | `/api/schedule/admin/slots/:id/toggle` | ✅ | Toggle slot |
| GET    | `/api/schedule/admin/blocked` | ✅ | All blocked dates |
| POST   | `/api/schedule/admin/blocked` | ✅ | Add blocked date |
| DELETE | `/api/schedule/admin/blocked/:date` | ✅ | Remove blocked date |

---

### Connecting the Frontend

In your React admin panel, replace the localStorage fake token logic:

**1. Login (`AdminLogin.jsx`):**
```js
const res  = await fetch("http://localhost:5000/api/auth/login", {
  method:  "POST",
  headers: { "Content-Type": "application/json" },
  body:    JSON.stringify({ username, password }),
});
const data = await res.json();
if (data.success) {
  localStorage.setItem("adminToken", data.token);
  navigate("/admin");
}
```

**2. API calls from admin panel:**
```js
const token = localStorage.getItem("adminToken");
const res = await fetch("http://localhost:5000/api/bookings/admin", {
  headers: { Authorization: `Bearer ${token}` },
});
```

**3. ProtectedRoute — verify token on load:**
```js
const res = await fetch("http://localhost:5000/api/auth/me", {
  headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
});
if (!res.ok) navigate("/admin/login");
```

---

### Environment Variables

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/kithulgala` |
| `JWT_SECRET` | Long random string for signing JWTs | `openssl rand -hex 64` |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | `development` or `production` | `development` |
| `CLIENT_ORIGIN` | Frontend URL for CORS | `http://localhost:5173` |
| `MAX_FILE_SIZE_MB` | Max upload size | `5` |

---

### Deployment

1. Set `NODE_ENV=production` in your server `.env`
2. Set `CLIENT_ORIGIN` to your live frontend URL
3. Use a strong `JWT_SECRET` (at least 64 random hex chars)
4. Use MongoDB Atlas instead of local MongoDB
5. Consider putting Nginx in front of Express to serve `/uploads` efficiently

```
rafting_frontend
├─ README.md
├─ backend
│  ├─ middleware
│  │  ├─ auth.js
│  │  ├─ errorHandler.js
│  │  └─ upload.js
│  ├─ models
│  │  ├─ Activity.js
│  │  ├─ Admin.js
│  │  ├─ Booking.js
│  │  ├─ Review.js
│  │  └─ Schedule.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ routes
│  │  ├─ activities.js
│  │  ├─ auth.js
│  │  ├─ bookings.js
│  │  ├─ reviews.js
│  │  └─ schedule.js
│  ├─ scripts
│  │  └─ seedAdmin.js
│  ├─ server.js
│  └─ uploads
│     ├─ 1778611191640-786f6007298e42b287320b38.png
│     └─ 1778625909545-b4a0f580eda7a953e23dd0d2.png
└─ frontend
   ├─ index.html
   ├─ package-lock.json
   ├─ package.json
   ├─ postcss.config.js
   ├─ public
   │  └─ hero_vid.mp4
   ├─ src
   │  ├─ AdminLogin.jsx
   │  ├─ App.jsx
   │  ├─ ProtectedRoute.jsx
   │  ├─ admin
   │  │  ├─ AdminApp.jsx
   │  │  ├─ components
   │  │  │  └─ AdminLayout.jsx
   │  │  ├─ pages
   │  │  │  ├─ ActivitiesPage.jsx
   │  │  │  ├─ BookingsPage.jsx
   │  │  │  ├─ CalendarPage.jsx
   │  │  │  ├─ Dashboard.jsx
   │  │  │  ├─ ReviewsPage.jsx
   │  │  │  └─ SchedulePage.jsx
   │  │  └─ store
   │  │     └─ mockData.js
   │  ├─ api
   │  │  └─ client.js
   │  ├─ components
   │  │  ├─ About.jsx
   │  │  ├─ Activities.jsx
   │  │  ├─ Booking.jsx
   │  │  ├─ Contact.jsx
   │  │  ├─ Footer.jsx
   │  │  ├─ Guidelines.jsx
   │  │  ├─ Hero.jsx
   │  │  ├─ Navbar.jsx
   │  │  ├─ ParallaxDivider.jsx
   │  │  ├─ Reviews.jsx
   │  │  └─ Schedule.jsx
   │  ├─ data
   │  │  └─ data.js
   │  ├─ index.css
   │  └─ main.jsx
   ├─ tailwind.config.js
   ├─ testfolder
   │  ├─ AdminLayout.jsx
   │  ├─ App.jsx
   │  └─ package.json
   └─ vite.config.js

```