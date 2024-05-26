require("dotenv").config();
const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const { path: ffmpegPath } = require("@ffmpeg-installer/ffmpeg");
const { errorMiddleware } = require("./middlewares/error");
const router = require("./routes");
const { log, error } = require("./utils/logger");
const { checkRedisConnection } = require("./services/redis");
const { checkQueueReady, isQueueConnectedToRedis } = require("./services/queue");

ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const port = process.env.PORT || 55766;
app.use(express.json());

app.use("/", router);

// Error-handling middleware
app.use(errorMiddleware);

// Start the server
app.listen(port, async () => {
  try {
    await checkRedisConnection();
    await checkQueueReady();
    log("Redis is connected and queue is ready");
    const isConnected = isQueueConnectedToRedis();
    log("Queue connected to Redis:", isConnected);
    log(`Server is running on port ${port}`);
    log(`Server is running on http://localhost:${port}`);
  } catch (err) {
    error("Failed to start server:", err);
    process.exit(1);
  }
});
