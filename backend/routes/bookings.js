const express = require("express");
const Booking = require("../models/Booking");
const Activity = require("../models/Activity");
const {
  isValidBookingTransition,
  normalizeBookingStatus,
  normalizeSelectedActivityIds,
  isValidBookingDate,
} = require("../models/Booking");
const { protect } = require("../middleware/auth");
const {
  isValidEmail,
  sendBookingConfirmedEmail,
  sendBookingRejectedEmail,
  sendBookingReceivedEmail,
  sendNewBookingNotification,
  sendPaymentInstructionsEmail,
} = require("../services/emailService");

function sanitizeMultilineText(value) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/bookings  — customer submits a booking from the public site
router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, activity, activities, date, slot, guests, total, message } = req.body;

    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address." });
    }

    const guestCount = parseInt(guests) || 1;
    const bookingDate = typeof date === "string" ? date.trim() : "";

    if (!isValidBookingDate(bookingDate)) {
      return res.status(400).json({ success: false, message: "Please provide a valid booking date in YYYY-MM-DD format." });
    }

    // Determine activities: accept legacy `activity` (string title) or new `activities` (array of IDs)
    let bookingActivities = [];
    const normalizedIds = normalizeSelectedActivityIds(activities);
    if (normalizedIds.length > 0) {
      const found = await Activity.find({ _id: { $in: normalizedIds }, active: true });
      if (found.length !== normalizedIds.length) {
        return res.status(400).json({ success: false, message: "One or more activities are invalid or inactive." });
      }
      bookingActivities = found.map(a => ({ activity: a._id, title: a.title, price: a.price }));
    } else if (typeof activity === "string" && activity.trim()) {
      // Legacy single-activity flow: find by title
      const found = await Activity.findOne({ title: activity.trim() });
      if (!found) {
        return res.status(400).json({ success: false, message: "Selected activity not found." });
      }
      bookingActivities = [{ activity: found._id, title: found.title, price: found.price }];
    } else {
      return res.status(400).json({ success: false, message: "Please select at least one activity." });
    }

    // Calculate total server-side; ignore client-provided `total`
    const totalPrice = bookingActivities.reduce((sum, a) => sum + (Number(a.price || 0) * guestCount), 0);

    const booking = await Booking.create({
      name,
      email: cleanEmail,
      phone,
      // Keep legacy `activity` populated for backward-compatibility
      activity: bookingActivities.map(a => a.title).join(", "),
      activities: bookingActivities,
      date: bookingDate,
      slot,
      guests: guestCount,
      total: totalPrice,
      message,
      status: "pending",
      adminNote: "",
    });

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
    if (activity) filter.$or = [{ activity: activity }, { "activities.title": activity }];
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
    const [total, pending, paymentPending, confirmed, completed, rejected, cancelled] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "payment_pending" }),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.countDocuments({ status: "completed" }),
      Booking.countDocuments({ status: "rejected" }),
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
    // Aggregate activity popularity supporting both legacy `activity` and new `activities` array
    const activityStats = await Booking.aggregate([
      {
        $project: {
          activitiesArr: {
            $cond: [
              { $gt: ["$activities", null] },
              "$activities",
              [{ title: "$activity" }]
            ]
          }
        }
      },
      { $unwind: "$activitiesArr" },
      { $group: { _id: "$activitiesArr.title", count: { $sum: 1 } } },
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
        total, pending, paymentPending, confirmed, completed, rejected, cancelled,
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

// POST /api/bookings/admin/:id/payment-instructions
router.post("/admin/:id/payment-instructions", protect, async (req, res, next) => {
  try {
    const { paymentInstructions } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });

    if (!isValidBookingTransition(booking.status, "payment_pending")) {
      return res.status(409).json({ success: false, message: "Booking is not in a valid state to send payment instructions." });
    }

    const nextInstructions = sanitizeMultilineText(paymentInstructions);
    const previousStatus = booking.status;
    const previousInstructions = booking.paymentInstructions;

    booking.status = "payment_pending";
    booking.paymentInstructions = nextInstructions;
    booking.paymentInstructionsSentAt = new Date();
    await booking.save();

    try {
      await sendPaymentInstructionsEmail(booking);
      return res.json({ success: true, data: booking });
    } catch (emailErr) {
      booking.status = previousStatus;
      booking.paymentInstructions = previousInstructions;
      booking.paymentInstructionsSentAt = null;
      await booking.save();
      console.error("Payment instruction email failed:", emailErr.message);
      return res.status(500).json({ success: false, message: "Failed to send payment instructions email. The booking was not changed." });
    }
  } catch (err) {
    next(err);
  }
});

// POST /api/bookings/admin/:id/confirm
router.post("/admin/:id/confirm", protect, async (req, res, next) => {
  try {
    const { adminNote } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });

    if (!isValidBookingTransition(booking.status, "confirmed")) {
      return res.status(409).json({ success: false, message: "Booking is not in a valid state to be confirmed." });
    }

    const previousStatus = booking.status;
    const previousAdminNote = booking.adminNote;
    const normalizedNote = sanitizeMultilineText(adminNote);

    booking.status = "confirmed";
    booking.adminNote = normalizedNote;
    booking.confirmedAt = new Date();
    await booking.save();

    try {
      await sendBookingConfirmedEmail(booking);
      return res.json({ success: true, data: booking });
    } catch (emailErr) {
      booking.status = previousStatus;
      booking.adminNote = previousAdminNote;
      booking.confirmedAt = null;
      await booking.save();
      console.error("Booking confirmation email failed:", emailErr.message);
      return res.status(500).json({ success: false, message: "Failed to send booking confirmation email. The booking was not changed." });
    }
  } catch (err) {
    next(err);
  }
});

// PATCH /api/bookings/admin/:id/status
// Body: { status }
router.patch("/admin/:id/status", protect, async (req, res, next) => {
  try {
    const requestedStatus = normalizeBookingStatus(req.body.status);
    const { adminNote } = req.body;
    const allowed = ["pending", "payment_pending", "confirmed", "completed", "rejected", "cancelled"];
    if (!allowed.includes(requestedStatus)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });

    if (!isValidBookingTransition(booking.status, requestedStatus) && !["rejected", "cancelled"].includes(requestedStatus)) {
      return res.status(409).json({ success: false, message: "This booking cannot transition to the requested status." });
    }

    booking.status = requestedStatus;
    booking.adminNote = typeof adminNote === "string" ? sanitizeMultilineText(adminNote) : "";
    if (requestedStatus === "rejected") booking.rejectedAt = new Date();
    if (requestedStatus === "confirmed") booking.confirmedAt = new Date();
    await booking.save();

    try {
      if (requestedStatus === "confirmed") {
        await sendBookingConfirmedEmail(booking);
      }

      if (requestedStatus === "rejected") {
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
