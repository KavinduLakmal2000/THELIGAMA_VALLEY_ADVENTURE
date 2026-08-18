const express  = require("express");
const Activity = require("../models/Activity");
const { protect } = require("../middleware/auth");
const upload   = require("../middleware/upload");
const {
  uploadActivityImageToR2,
  deleteR2Image,
  normalizeActivityImageUrl,
  isR2ImageUrl,
} = require("../services/r2Service");

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

    let uploadedImageUrl = "";

    if (req.file) {
      uploadedImageUrl = await uploadActivityImageToR2(req.file);
    }

    try {
      const activity = await Activity.create({
        title, location, duration,
        price:     parseFloat(price)    || 0,
        tag:       tag || "",
        minAge:    parseInt(minAge)     || 6,
        maxGuests: parseInt(maxGuests)  || 20,
        active:    active !== "false",
        order:     parseInt(order)      || 0,
        image:     normalizeActivityImageUrl(uploadedImageUrl),
      });

      res.status(201).json({ success: true, data: activity });
    } catch (createErr) {
      if (uploadedImageUrl && isR2ImageUrl(uploadedImageUrl)) {
        try {
          await deleteR2Image(uploadedImageUrl);
        } catch (cleanupErr) {
          console.error("❌ Failed to clean up uploaded R2 image after create failure:", cleanupErr.message);
        }
      }
      throw createErr;
    }
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
    const previousImageValue = activity.image || "";
    let uploadedImageUrl = "";

    if (req.file) {
      uploadedImageUrl = await uploadActivityImageToR2(req.file);
    }

    try {
      const nextImageValue = req.file ? normalizeActivityImageUrl(uploadedImageUrl) : previousImageValue;

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
        ...(req.file  && { image: nextImageValue }),
      };

      const updated = await Activity.findByIdAndUpdate(
        req.params.id, updates, { new: true, runValidators: true }
      );

      if (req.file && previousImageValue && isR2ImageUrl(previousImageValue)) {
        try {
          await deleteR2Image(previousImageValue);
        } catch (deleteErr) {
          console.error("❌ Failed to delete previous R2 image on activity update:", deleteErr.message);
        }
      }

      res.json({ success: true, data: updated });
    } catch (updateErr) {
      if (uploadedImageUrl && isR2ImageUrl(uploadedImageUrl)) {
        try {
          await deleteR2Image(uploadedImageUrl);
        } catch (cleanupErr) {
          console.error("❌ Failed to clean up new uploaded R2 image after update failure:", cleanupErr.message);
        }
      }
      throw updateErr;
    }
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

// DELETE /api/activities/admin/:id  — delete + remove R2 object when applicable
router.delete("/admin/:id", protect, async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: "Activity not found." });

    if (activity.image && isR2ImageUrl(activity.image)) {
      try {
        await deleteR2Image(activity.image);
      } catch (deleteErr) {
        console.error("❌ Failed to delete R2 image on activity delete:", deleteErr.message);
      }
    }

    await activity.deleteOne();
    res.json({ success: true, message: "Activity deleted." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
