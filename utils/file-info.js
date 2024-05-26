const { getVideoDurationInSeconds } = require("get-video-duration");
const fs = require("node:fs");
const crypto = require("node:crypto");

// Function to calculate checksum
const calculateChecksum = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const fileStream = fs.createReadStream(filePath);

    fileStream.on("error", reject);

    fileStream.on("data", (chunk) => {
      hash.update(chunk);
    });

    fileStream.on("end", () => {
      const checksum = hash.digest("hex");
      resolve(checksum);
    });
  });
};

module.exports = {
  calculateChecksum,
  getVideoDurationInSeconds,
};
