require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");
const dns = require("dns");

const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");
const activityRoutes = require("./routes/activities");
const reviewRoutes = require("./routes/reviews");
const scheduleRoutes = require("./routes/schedule");
const { verifySmtpConnection } = require("./services/emailService");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;


dns.resolve4("smtp.gmail.com", (err, addresses) => {
  if (err) {
    console.error("❌ Gmail IPv4 DNS failed:", err);
  } else {
    console.log("✅ Gmail IPv4 addresses:", addresses);
  }
});

// ─── Database ─────────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");

    console.log("🔍 Starting SMTP verification...");
    console.log("📧 Gmail user configured:", !!process.env.GMAIL_USER);
    console.log("🔑 Gmail App Password configured:", !!process.env.GMAIL_APP_PASSWORD);

    const smtpReady = await verifySmtpConnection();

    if (smtpReady) {
      console.log("✅ SMTP verification successful");
    } else {
      console.log("❌ SMTP verification failed");
    }

    console.log("🏁 SMTP verification finished");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ─── Security middleware ──────────────────────────────────────────────────────

// CORS — only allow your frontend origin
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map(o => o.trim());

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, Postman, same-origin SSR)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "same-site" }, // allow /uploads to load in-browser
}));

// Logging (skip in test)
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

// Body parsing
app.use(express.json({ limit: "10kb" }));       // limit JSON body size
app.use(express.urlencoded({ extended: true }));

// Sanitize MongoDB operators in request bodies ($, .)
app.use(mongoSanitize());

// ─── Rate limiting ─────────────────────────────────────────────────────────── 
// Strict limit on auth endpoint to slow brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: "Too many login attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: "Too many requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth/login", authLimiter);
app.use("/api", apiLimiter);

// ─── Static files — legacy local uploads remain available for compatibility ─
// Old database records may still point to a filename served from /uploads/<filename>
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  maxAge: "7d",
}));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/schedule", scheduleRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    env: process.env.NODE_ENV,
    time: new Date().toISOString(),
  });
});

// 404 for unknown API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT} [${process.env.NODE_ENV}]`);
});
