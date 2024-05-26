const multer = require("multer");
const fs = require("node:fs");
const path = require("node:path");
const { uploadDir, VIDEO_FILE_SIZE_LIMIT } = require("../utils/constants");
const { v4: uuidv4 } = require("uuid");

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const multerUpload = multer({
  storage: storage,
  limits: { fileSize: VIDEO_FILE_SIZE_LIMIT },
});

module.exports = { multerUpload };
