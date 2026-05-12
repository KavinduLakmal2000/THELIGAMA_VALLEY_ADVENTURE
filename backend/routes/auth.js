const express = require("express");
const jwt     = require("jsonwebtoken");
const Admin   = require("../models/Admin");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ── Helper: sign JWT ──────────────────────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Body: { username, password }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required." });
    }

    // Find admin and explicitly select password (select:false in schema)
    const admin = await Admin.findOne({ username: username.toLowerCase() }).select("+password");

    if (!admin || !(await admin.matchPassword(password))) {
      // Same message for both — prevents username enumeration
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const token = signToken(admin._id);

    res.status(200).json({
      success: true,
      token,
      admin: { id: admin._id, username: admin.username },
    });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/me  (protected)
// Verify token is still valid and return admin info
// ─────────────────────────────────────────────────────────────────────────────
router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    admin: { id: req.admin._id, username: req.admin.username },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/auth/change-password  (protected)
// Body: { currentPassword, newPassword }
// ─────────────────────────────────────────────────────────────────────────────
router.put("/change-password", protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Both fields are required." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "New password must be at least 8 characters." });
    }

    const admin = await Admin.findById(req.admin._id).select("+password");

    if (!(await admin.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, message: "Current password is incorrect." });
    }

    admin.password = newPassword; // pre-save hook will hash it
    await admin.save();

    res.json({ success: true, message: "Password updated." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
