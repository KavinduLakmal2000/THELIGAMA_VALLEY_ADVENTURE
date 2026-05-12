const express  = require("express");
const fs       = require("fs");
const path     = require("path");
const Activity = require("../models/Activity");
const { protect } = require("../middleware/auth");
const upload   = require("../middleware/upload");

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/activities  — public, only active activities
router.get("/", async (req, res, next) => {
  try {
    const activities = await Activity.find({ active: true }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: activities });
  } catch (err) {
    next(err);
  }
});

// GET /api/activities/:id  — public single activity
router.get("/:id", async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity || !activity.active) {
      return res.status(404).json({ success: false, message: "Activity not found." });
    }
    res.json({ success: true, data: activity });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — protected
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/activities/admin/all  — all activities (incl. inactive)
router.get("/admin/all", protect, async (req, res, next) => {
  try {
    const activities = await Activity.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: activities });
  } catch (err) {
    next(err);
  }
});

// POST /api/activities/admin  — create activity (with optional image)
router.post("/admin", protect, upload.single("image"), async (req, res, next) => {
  try {
    const { title, location, duration, price, tag, minAge, maxGuests, active, order } = req.body;

    const activity = await Activity.create({
      title, location, duration,
      price:     parseFloat(price)    || 0,
      tag:       tag || "",
      minAge:    parseInt(minAge)     || 6,
      maxGuests: parseInt(maxGuests)  || 20,
      active:    active !== "false",
      order:     parseInt(order)      || 0,
      image:     req.file ? req.file.filename : "",
    });

    res.status(201).json({ success: true, data: activity });
  } catch (err) {
    next(err);
  }
});

// PUT /api/activities/admin/:id  — update (with optional new image)
router.put("/admin/:id", protect, upload.single("image"), async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: "Activity not found." });

    const { title, location, duration, price, tag, minAge, maxGuests, active, order } = req.body;

    // If a new image was uploaded, delete the old one from disk
    if (req.file && activity.image) {
      const oldPath = path.join(__dirname, "../uploads", activity.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const updates = {
      ...(title     !== undefined && { title }),
      ...(location  !== undefined && { location }),
      ...(duration  !== undefined && { duration }),
      ...(price     !== undefined && { price: parseFloat(price) }),
      ...(tag       !== undefined && { tag }),
      ...(minAge    !== undefined && { minAge: parseInt(minAge) }),
      ...(maxGuests !== undefined && { maxGuests: parseInt(maxGuests) }),
      ...(active    !== undefined && { active: active !== "false" }),
      ...(order     !== undefined && { order: parseInt(order) }),
      ...(req.file  && { image: req.file.filename }),
    };

    const updated = await Activity.findByIdAndUpdate(
      req.params.id, updates, { new: true, runValidators: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/activities/admin/:id/toggle  — flip active flag
router.patch("/admin/:id/toggle", protect, async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: "Activity not found." });

    activity.active = !activity.active;
    await activity.save();

    res.json({ success: true, data: activity });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/activities/admin/:id  — delete + remove image from disk
router.delete("/admin/:id", protect, async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: "Activity not found." });

    // Remove image file
    if (activity.image) {
      const imgPath = path.join(__dirname, "../uploads", activity.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await activity.deleteOne();
    res.json({ success: true, message: "Activity deleted." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
