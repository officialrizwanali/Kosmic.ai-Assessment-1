const multer = require("multer");
const { error } = require("../utils/logger");

const errorMiddleware = (err, req, res, next) => {
  error(err.code);
  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large. Maximum size allowed is 100MB." });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ error: "Too many files uploaded. Only one file is allowed." });
    }
    // Add more cases if needed
  }
  // Handle other errors
  res.status(500).json({ error: "An unknown error occurred." });
};

module.exports = { errorMiddleware };
