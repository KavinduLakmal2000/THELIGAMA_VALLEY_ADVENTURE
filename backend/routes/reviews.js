const express = require("express");
const Review  = require("../models/Review");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/reviews  — only approved reviews for the public site
router.get("/", async (req, res, next) => {
  try {
    const reviews = await Review.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
});

// POST /api/reviews  — guest submits a review
router.post("/", async (req, res, next) => {
  try {
    const { name, location, rating, text, activity } = req.body;

    if (!name || !rating || !text) {
      return res.status(400).json({ success: false, message: "Name, rating, and review text are required." });
    }

    const review = await Review.create({
      name, location, rating: parseInt(rating), text, activity,
      status: "pending", // always goes through moderation first
    });

    res.status(201).json({ success: true, message: "Review submitted for moderation. Thank you!", data: review });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — protected
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/reviews/admin?status=pending
router.get("/admin", protect, async (req, res, next) => {
  try {
    const { status, sort = "createdAt", order = "desc" } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const reviews = await Review.find(filter).sort({ [sort]: order === "asc" ? 1 : -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/reviews/admin/:id/status
// Body: { status }  — "approved" | "pending" | "hidden"
router.patch("/admin/:id/status", protect, async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "approved", "hidden"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    if (!review) return res.status(404).json({ success: false, message: "Review not found." });

    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/reviews/admin/:id
router.delete("/admin/:id", protect, async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found." });
    res.json({ success: true, message: "Review deleted." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
