const { success, info, error } = require("../utils/logger");
const { getVideoDurationInSeconds, calculateChecksum } = require("../utils/file-info");
const fs = require("node:fs");
const path = require("node:path");
const { uploadDir, VIDEO_DURATION_LIMIT } = require("../utils/constants");
const crypto = require("node:crypto");
const { pathExists, createDirectory, joinPaths, removeFile } = require("../services/storage");

const downloadLinks = {};

// Directory for uploads
if (!pathExists(uploadDir)) {
  createDirectory(uploadDir);
}

const uploadVideo = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded" });
  }

  const filePath = joinPaths(uploadDir, req.file.filename);
  success("File uploaded to:", filePath);
  try {
    if (req.body.checkFileUploadIntegrity?.toLowerCase() === "true") {
      // Calculate checksum of the uploaded file
      const uploadedChecksum = req.body.checksum;
      info("Uploaded checksum:", uploadedChecksum);
      const calculatedChecksum = await calculateChecksum(filePath);
      info("Calculated checksum:", calculatedChecksum);

      // Compare checksums
      if (uploadedChecksum !== calculatedChecksum) {
        error("Checksum verification failed");
        removeFile(filePath);
        return res.status(400).send({ error: "Checksum verification failed" });
      }
    }

    // Additional validation and processing
    const duration = await getVideoDurationInSeconds(filePath);
    info("Video duration:", duration, "seconds");
    if (duration > VIDEO_DURATION_LIMIT) {
      error(`Video exceeds maximum allowed duration, i.e., ${VIDEO_DURATION_LIMIT} seconds`);
      removeFile(filePath);
      return res.status(400).send({ error: "Video exceeds maximum allowed duration" });
    }
    success("Video uploaded successfully, named:", req.file.filename);
    res.send({ filename: req.file.filename });
  } catch (error) {
    error(error || "Failed to upload video");
    removeFile(filePath);
    // res.status(500).send({ error: "Failed to process video" });
    next(error);
  }
};

const getFileDownloadToken = (req, res) => {
  const { filename } = req.body;
  if (!filename) {
    return res.status(400).send({ error: "No filename provided" });
  }

  const filePath = joinPaths(uploadDir, filename);
  if (!pathExists(filePath)) {
    return res.status(404).send({ error: "File not found" });
  }

  const token = crypto.randomBytes(20).toString("hex");
  const expirationTime = Date.now() + 60 * 60 * 1000; // 1 hour

  downloadLinks[token] = { filename, expirationTime };
  res.send({ downloadLink: `/video/download/${token}` });
};

const downloadFileByToken = (req, res) => {
  const { token } = req.params;
  const link = downloadLinks[token];

  if (!link || Date.now() > link.expirationTime) {
    return res.status(404).send({ error: "Link expired or invalid" });
  }

  const filePath = joinPaths(uploadDir, link.filename);
  res.download(filePath, (err) => {
    if (err) {
      return res.status(500).send({ error: "Failed to download file" });
    }
  });
};

module.exports = {
  uploadVideo,
  getFileDownloadToken,
  downloadFileByToken,
};
