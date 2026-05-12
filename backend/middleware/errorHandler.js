const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message    = err.message    || "Server error";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message    = "Invalid ID format";
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value for ${field}`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(". ");
  }

  // Multer file size exceeded
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = `File too large. Max size is ${process.env.MAX_FILE_SIZE_MB || 5} MB.`;
  }

  if (process.env.NODE_ENV === "development") {
    console.error("❌", err.stack || err);
  }

  res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
