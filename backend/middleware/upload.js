const multer = require("multer");
const path   = require("path");
const crypto = require("crypto");

// ── Storage ───────────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    // Random hex prefix + original extension → prevents filename collisions
    const ext    = path.extname(file.originalname).toLowerCase();
    const random = crypto.randomBytes(12).toString("hex");
    cb(null, `${Date.now()}-${random}${ext}`);
  },
});

// ── File filter ───────────────────────────────────────────────────────────────
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed."), false);
  }
};

// ── Export ────────────────────────────────────────────────────────────────────
const MAX_MB = parseInt(process.env.MAX_FILE_SIZE_MB || "5");

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_MB * 1024 * 1024 },
});

module.exports = upload;
