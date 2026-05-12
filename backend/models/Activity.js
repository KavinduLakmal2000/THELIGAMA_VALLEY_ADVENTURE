const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    title:     { type: String, required: true, trim: true },
    location:  { type: String, required: true, trim: true },
    duration:  { type: String, required: true },
    price:     { type: Number, required: true, min: 0 },
    tag:       { type: String, default: "" },
    minAge:    { type: Number, default: 6 },
    maxGuests: { type: Number, default: 20 },
    active:    { type: Boolean, default: true },
    // image: stored filename, served from /uploads/<filename>
    image:     { type: String, default: "" },
    order:     { type: Number, default: 0 }, // for custom sort order
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
