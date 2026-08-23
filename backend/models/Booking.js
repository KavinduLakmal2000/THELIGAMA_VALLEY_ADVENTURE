const mongoose = require("mongoose");

const BOOKING_STATUS = [
  "pending",
  "payment_pending",
  "confirmed",
  "completed",
  "rejected",
  "cancelled",
];

const BOOKING_STATUS_TRANSITIONS = {
  pending: ["payment_pending", "rejected"],
  payment_pending: ["confirmed"],
  confirmed: [],
  completed: [],
  rejected: [],
  cancelled: [],
};

function normalizeBookingStatus(status) {
  if (status === "cancelled") return "rejected";
  return status;
}

function isValidBookingTransition(fromStatus, toStatus) {
  const start = normalizeBookingStatus(fromStatus);
  const end = normalizeBookingStatus(toStatus);
  const transitions = BOOKING_STATUS_TRANSITIONS[start] || [];
  return transitions.includes(end);
}

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
    adminNote: { type: String, default: "" },
    paymentInstructions: { type: String, default: "" },
    paymentInstructionsSentAt: { type: Date, default: null },
    confirmedAt: { type: Date, default: null },
    rejectedAt: { type: Date, default: null },
    status: {
      type:    String,
      enum:    BOOKING_STATUS,
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
module.exports.BOOKING_STATUS = BOOKING_STATUS;
module.exports.BOOKING_STATUS_TRANSITIONS = BOOKING_STATUS_TRANSITIONS;
module.exports.normalizeBookingStatus = normalizeBookingStatus;
module.exports.isValidBookingTransition = isValidBookingTransition;
