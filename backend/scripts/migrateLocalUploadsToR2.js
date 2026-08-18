#!/usr/bin/env node

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Activity = require("../models/Activity");
const { uploadActivityImageToR2, isR2ImageUrl, normalizeActivityImageUrl } = require("../services/r2Service");

const uploadsDir = path.join(__dirname, "../uploads");
const shouldUpdate = process.argv.includes("--update");

const log = (msg) => console.log(msg);

const ensureReady = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required for the upload migration.");
  }

  await mongoose.connect(process.env.MONGO_URI);
  log("✅ Connected to MongoDB for migration.");
};

const main = async () => {
  try {
    await ensureReady();

    if (!fs.existsSync(uploadsDir)) {
      log(`No upload directory found at ${uploadsDir}. Nothing to migrate.`);
      return;
    }

    const files = fs.readdirSync(uploadsDir)
      .filter((fileName) => fs.statSync(path.join(uploadsDir, fileName)).isFile())
      .sort();

    if (!files.length) {
      log("No local upload files found in backend/uploads/. Nothing to migrate.");
      return;
    }

    log(`Found ${files.length} local upload file(s) to review.`);

    let migrated = 0;
    let skipped = 0;
    let missingActivities = 0;

    for (const fileName of files) {
      const ext = path.extname(fileName).toLowerCase();
      const mimeMap = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
      };
      const mimetype = mimeMap[ext] || "application/octet-stream";
      const matchingActivities = await Activity.find({
        $or: [
          { image: fileName },
          { image: `/uploads/${fileName}` },
          { image: `uploads/${fileName}` },
        ],
      });

      if (!matchingActivities.length) {
        missingActivities += 1;
        log(`- ${fileName}: no matching Activity image value found.`);
        continue;
      }

      for (const activity of matchingActivities) {
        if (activity.image && isR2ImageUrl(activity.image)) {
          log(`- ${fileName}: activity ${activity._id} already points to R2; skipping.`);
          skipped += 1;
          continue;
        }

        if (!shouldUpdate) {
          log(`- ${fileName}: would migrate for activity ${activity._id}. Re-run with --update.`);
          skipped += 1;
          continue;
        }

        const fileBuffer = fs.readFileSync(path.join(uploadsDir, fileName));
        const publicUrl = await uploadActivityImageToR2({
          originalname: fileName,
          mimetype,
          buffer: fileBuffer,
        });

        activity.image = normalizeActivityImageUrl(publicUrl);
        await activity.save();

        migrated += 1;
        log(`- ${fileName}: migrated for activity ${activity._id} -> ${publicUrl}`);
      }
    }

    log("\nMigration summary:");
    log(`- Files reviewed: ${files.length}`);
    log(`- Activities migrated: ${migrated}`);
    log(`- Existing R2 records skipped: ${skipped}`);
    log(`- Files with no matching activity: ${missingActivities}`);
    log("Use --update to actually upload and update database records. Without --update, this is a dry run.");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

main();
