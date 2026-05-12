const express = require("express");
const Booking = require("../models/Booking");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/bookings  — customer submits a booking from the public site
router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, activity, date, slot, guests, total, message } = req.body;

    const booking = await Booking.create({
      name, email, phone, activity, date, slot,
      guests: parseInt(guests) || 1,
      total:  parseInt(total)  || 0,
      message,
      status: "pending",
    });

    res.status(201).json({ success: true, data: booking });
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

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
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
