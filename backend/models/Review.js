const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    location: { type: String, default: "" },
    rating:   { type: Number, required: true, min: 1, max: 5 },
    text:     { type: String, required: true },
    activity: { type: String, default: "" },
    status: {
      type:    String,
      enum:    ["pending", "approved", "hidden"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
