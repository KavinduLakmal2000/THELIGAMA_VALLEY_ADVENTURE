const express = require("express");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const { protect } = require("../middleware/auth");
const {
  isValidEmail,
  generateVerificationToken,
  hashVerificationToken,
  sendEmailVerification,
  sendBookingConfirmedEmail,
  sendBookingRejectedEmail,
  sendBookingReceivedEmail,
  sendNewBookingNotification,
} = require("../services/emailService");

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/bookings  — customer submits a booking from the public site
router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, activity, date, slot, guests, total, message } = req.body;

    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address." });
    }

    const verificationToken = generateVerificationToken();
    const booking = await Booking.create({
      name, email: cleanEmail, phone, activity, date, slot,
      guests: parseInt(guests) || 1,
      total:  parseInt(total)  || 0,
      message,
      status: "pending",
      emailVerified: false,
      emailVerificationTokenHash: hashVerificationToken(verificationToken),
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    try {
      await sendEmailVerification(booking, verificationToken);
    } catch (emailErr) {
      console.error("Booking verification email failed:", emailErr.message);
    }

    // Send immediate post-booking notifications (do not block booking creation on failure)
    try {
      await sendBookingReceivedEmail(booking);
    } catch (custErr) {
      console.error("Booking received email failed:", custErr.message);
    }

    try {
      await sendNewBookingNotification(booking);
    } catch (compErr) {
      console.error("Company booking notification failed:", compErr.message);
    }

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
});

// GET /api/bookings/verify-email
router.get("/verify-email", async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(400).json({ success: false, message: "Verification token is missing." });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const booking = await Booking.findOne({
      emailVerificationTokenHash: hashedToken,
      emailVerificationExpires: { $gt: new Date() },
    }).exec();

    if (!booking) {
      return res.status(400).json({ success: false, message: "Verification link is invalid or has expired." });
    }

    booking.emailVerified = true;
    booking.emailVerificationTokenHash = null;
    booking.emailVerificationExpires = null;
    await booking.save();

    return res.json({ success: true, message: "Email verified successfully." });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — all routes below require JWT
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/bookings/admin
// Query params: status, activity, date, search, sort, order, page, limit
router.get("/admin", protect, async (req, res, next) => {
  try {
    const {
      status, activity, date, search,
      sort = "createdAt", order = "desc",
      page = 1, limit = 50,
    } = req.query;

    const filter = {};
    if (status)   filter.status   = status;
    if (activity) filter.activity = activity;
    if (date)     filter.date     = date;
    if (search) {
      const q = new RegExp(search, "i");
      filter.$or = [{ name: q }, { email: q }, { phone: q }];
    }

    const sortObj = { [sort]: order === "asc" ? 1 : -1 };

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(parseInt(limit)),
      Booking.countDocuments(filter),
    ]);

    res.json({ success: true, total, page: +page, data: bookings });
  } catch (err) {
    next(err);
  }
});

// GET /api/bookings/admin/stats  — dashboard numbers
router.get("/admin/stats", protect, async (req, res, next) => {
  try {
    const [total, pending, confirmed, completed, cancelled] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.countDocuments({ status: "completed" }),
      Booking.countDocuments({ status: "cancelled" }),
    ]);

    // Revenue from non-cancelled bookings
    const revenueResult = await Booking.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRevenue = await Booking.aggregate([
      { $match: { status: { $ne: "cancelled" }, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          count:   { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Activity popularity
    const activityStats = await Booking.aggregate([
      { $group: { _id: "$activity", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Upcoming bookings (next 7 days, not cancelled)
    const today = new Date().toISOString().split("T")[0];
    const upcoming = await Booking.find({
      date:   { $gte: today },
      status: { $ne: "cancelled" },
    }).sort({ date: 1 }).limit(5);

    res.json({
      success: true,
      data: {
        total, pending, confirmed, completed, cancelled,
        totalRevenue, monthlyRevenue, activityStats, upcoming,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/bookings/admin/:id
router.get("/admin/:id", protect, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/bookings/admin/:id/status
// Body: { status }
router.patch("/admin/:id/status", protect, async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });

    booking.status = status;
    await booking.save();

    try {
      if (status === "confirmed") {
        await sendBookingConfirmedEmail(booking);
      }

      if (status === "cancelled") {
        await sendBookingRejectedEmail(booking);
      }
    } catch (emailErr) {
      console.error("Booking status email failed:", emailErr.message);
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/bookings/admin/:id
router.delete("/admin/:id", protect, async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
    res.json({ success: true, message: "Booking deleted." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
