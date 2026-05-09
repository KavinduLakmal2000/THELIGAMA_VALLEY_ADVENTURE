# KithulGala Adventures — React + Tailwind Frontend

A full-featured React frontend for KithulGala River Adventures, built with Vite + React 18 + Tailwind CSS v3.

## 🚀 Quick Start

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

## 📁 Project Structure

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

## 🎨 Design System

- **Font — Display:** Bebas Neue (headings)
- **Font — UI:** Syne (labels, nav, badges)
- **Font — Body:** DM Sans (paragraphs)
- **Primary accent:** Cyan-500 (#06b6d4)
- **Secondary accent:** Teal-500 (#14b8a6)
- **Background:** Stone-950 / Stone-900

## 🗂 Editing Content

All text, images, pricing, reviews, and schedule data lives in `src/data/data.js`.
No need to hunt through component files — change it once, it updates everywhere.

## 📅 Booking & Calendar

The `Booking.jsx` component includes:
- A fully custom mini-calendar (no external dependency)
- Activity picker with pricing
- Time slot selection
- Guest count + price estimation
- Form validation
- Booking confirmation screen

## 🎬 Hero Video

Place your video at `public/hero_vid.mp4`. It will autoplay muted and loop as the hero background.
Supported formats: `.mp4`, `.webm`. Recommended resolution: 1920×1080.
