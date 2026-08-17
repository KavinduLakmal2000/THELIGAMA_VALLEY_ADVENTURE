const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, trim: true, lowercase: true },
    phone:    { type: String, required: true, trim: true },
    activity: { type: String, required: true },
    date:     { type: String, required: true },   // "YYYY-MM-DD"
    slot:     { type: String, required: true, enum: ["Morning", "Midday", "Afternoon"] },
    guests:   { type: Number, required: true, min: 1, max: 50 },
    total:    { type: Number, default: 0 },
    message:  { type: String, default: "" },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationTokenHash: {
      type: String,
      default: null,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
    },
    status: {
      type:    String,
      enum:    ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Auto-generate a human-readable booking ID like BK001
bookingSchema.virtual("bookingId").get(function () {
  return "BK" + String(this._id).slice(-6).toUpperCase();
});

module.exports = mongoose.model("Booking", bookingSchema);
