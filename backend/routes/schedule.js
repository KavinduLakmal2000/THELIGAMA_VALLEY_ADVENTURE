const express = require("express");
const { Slot, BlockedDate } = require("../models/Schedule");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/schedule/slots  — active slots only (public booking form)
router.get("/slots", async (req, res, next) => {
  try {
    const slots = await Slot.find({ active: true });
    res.json({ success: true, data: slots });
  } catch (err) {
    next(err);
  }
});

// GET /api/schedule/blocked  — blocked dates (public booking form uses this to disable calendar days)
router.get("/blocked", async (req, res, next) => {
  try {
    const blocked = await BlockedDate.find().sort({ date: 1 });
    res.json({ success: true, data: blocked });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — protected
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/schedule/admin/slots  — all slots (incl. inactive)
router.get("/admin/slots", protect, async (req, res, next) => {
  try {
    const slots = await Slot.find();
    res.json({ success: true, data: slots });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/schedule/admin/slots/:id/toggle
router.patch("/admin/slots/:id/toggle", protect, async (req, res, next) => {
  try {
    const slot = await Slot.findOne({ id: req.params.id });
    if (!slot) return res.status(404).json({ success: false, message: "Slot not found." });

    slot.active = !slot.active;
    await slot.save();
    res.json({ success: true, data: slot });
  } catch (err) {
    next(err);
  }
});

// GET /api/schedule/admin/blocked
router.get("/admin/blocked", protect, async (req, res, next) => {
  try {
    const blocked = await BlockedDate.find().sort({ date: 1 });
    res.json({ success: true, data: blocked });
  } catch (err) {
    next(err);
  }
});

// POST /api/schedule/admin/blocked
// Body: { date, reason }
router.post("/admin/blocked", protect, async (req, res, next) => {
  try {
    const { date, reason } = req.body;
    if (!date) return res.status(400).json({ success: false, message: "Date is required." });

    const entry = await BlockedDate.create({ date, reason: reason || "" });
    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/schedule/admin/blocked/:date
router.delete("/admin/blocked/:date", protect, async (req, res, next) => {
  try {
    await BlockedDate.deleteOne({ date: req.params.date });
    res.json({ success: true, message: "Date unblocked." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
