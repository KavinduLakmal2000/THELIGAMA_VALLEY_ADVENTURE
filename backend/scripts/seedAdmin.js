require("dotenv").config();
const mongoose = require("mongoose");
const Admin    = require("../models/Admin");
const { Slot } = require("../models/Schedule");

const DEFAULT_ADMIN = {
  username: "admin",
  password: "kithulgala2025",  // change this immediately after first login
};

const DEFAULT_SLOTS = [
  { id: "morning",   label: "Morning",   time: "8:00 AM – 11:00 AM",  active: true },
  { id: "midday",    label: "Midday",    time: "11:30 AM – 2:30 PM",  active: true },
  { id: "afternoon", label: "Afternoon", time: "3:00 PM – 5:00 PM",   active: true },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Admin account
    const existing = await Admin.findOne({ username: DEFAULT_ADMIN.username });
    if (existing) {
      console.log("ℹ️  Admin account already exists — skipping.");
    } else {
      await Admin.create(DEFAULT_ADMIN);
      console.log(`✅ Admin created → username: ${DEFAULT_ADMIN.username}`);
      console.log(`   ⚠️  Change the password after first login!`);
    }

    // Time slots
    for (const slot of DEFAULT_SLOTS) {
      await Slot.updateOne({ id: slot.id }, slot, { upsert: true });
    }
    console.log("✅ Default time slots seeded");

    await mongoose.disconnect();
    console.log("✅ Done. Database connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
