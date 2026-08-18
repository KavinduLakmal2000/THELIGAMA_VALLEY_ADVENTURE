const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { randomUUID } = require("crypto");
const path = require("path");

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const getR2PublicBaseUrl = () => (process.env.R2_PUBLIC_URL || "").replace(/\/+$/, "");

const hasR2Config = () => {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME &&
    process.env.R2_PUBLIC_URL
  );
};

const getR2Client = () => {
  if (!hasR2Config()) return null;

  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
  });
};

const isR2ImageUrl = (value) => {
  if (!value || typeof value !== "string") return false;

  const trimmed = value.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) return false;

  const base = getR2PublicBaseUrl();
  return trimmed.startsWith(base) || trimmed.includes(".r2.cloudflarestorage.com") || trimmed.includes("cloudflarestorage.com");
};

const normalizeActivityImageUrl = (value) => {
  if (!value || typeof value !== "string") return "";

  const trimmed = value.trim();
  if (!trimmed) return "";

  return trimmed;
};

const buildPublicUrlFromKey = (key) => {
  const cleanKey = String(key || "").replace(/^\/+/, "");
  const baseUrl = getR2PublicBaseUrl();

  if (!cleanKey || !baseUrl) return cleanKey;
  return `${baseUrl}/${cleanKey}`;
};

const extractR2ObjectKey = (imageValue) => {
  if (!imageValue || typeof imageValue !== "string") return null;

  const trimmed = imageValue.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      const base = getR2PublicBaseUrl();
      let pathname = url.pathname;

      if (base) {
        try {
          const baseUrl = new URL(base);
          const basePath = baseUrl.pathname || "/";
          if (pathname.startsWith(basePath)) {
            pathname = pathname.slice(basePath.length);
          }
        } catch (_) {
          // Ignore malformed public URL values; continue with the raw pathname.
        }
      }

      const cleanPath = pathname.replace(/^\/+/, "");
      return cleanPath || null;
    } catch (_) {
      return null;
    }
  }

  if (trimmed.includes("/")) {
    return trimmed.replace(/^\/+/, "");
  }

  return null;
};

const uploadActivityImageToR2 = async (file) => {
  if (!file) return "";

  if (!hasR2Config()) {
    throw new Error("R2 configuration is missing. Add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_URL.");
  }

  const mimeType = (file.mimetype || "").toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    throw new Error("Only JPEG, PNG, and WebP images are allowed.");
  }

  const ext = path.extname(file.originalname || "image.jpg").toLowerCase() || ".jpg";
  const objectKey = `activities/${Date.now()}-${randomUUID()}${ext}`;
  const client = getR2Client();

  await client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: objectKey,
    Body: file.buffer,
    ContentType: mimeType,
  }));

  return buildPublicUrlFromKey(objectKey);
};

const deleteR2Image = async (imageValue) => {
  const key = extractR2ObjectKey(imageValue);
  if (!key) return false;

  const client = getR2Client();
  if (!client) return false;

  await client.send(new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  }));

  return true;
};

module.exports = {
  ALLOWED_IMAGE_TYPES,
  hasR2Config,
  isR2ImageUrl,
  normalizeActivityImageUrl,
  buildPublicUrlFromKey,
  extractR2ObjectKey,
  uploadActivityImageToR2,
  deleteR2Image,
};
