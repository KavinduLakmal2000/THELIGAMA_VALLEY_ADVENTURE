const mongoose = require("mongoose");

// ── Time Slots ────────────────────────────────────────────────────────────────
const slotSchema = new mongoose.Schema({
  id:     { type: String, required: true, unique: true }, // "morning" | "midday" | "afternoon"
  label:  { type: String, required: true },
  time:   { type: String, required: true },
  active: { type: Boolean, default: true },
});

// ── Blocked Dates ─────────────────────────────────────────────────────────────
const blockedDateSchema = new mongoose.Schema({
  date:   { type: String, required: true, unique: true }, // "YYYY-MM-DD"
  reason: { type: String, default: "" },
}, { timestamps: true });

const Slot        = mongoose.model("Slot",        slotSchema);
const BlockedDate = mongoose.model("BlockedDate", blockedDateSchema);

module.exports = { Slot, BlockedDate };
