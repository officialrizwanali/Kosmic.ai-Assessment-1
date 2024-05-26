const { error, info } = require("../utils/logger");
const Queue = require("bull");
const { processVideo } = require("./videoProcessing");

// Initialize Bull queue for video processing tasks
const videoQueue = new Queue("video processing");

// Log progress and completion of jobs
videoQueue.on("progress", (job, progress) => {
  info(`Job ${job.id} is ${progress}% complete`);
});

videoQueue.on("completed", (job, result) => {
  info(`Job ${job.id} completed with result ${result}`);
});

videoQueue.on("completed", (job, result) => {
  info(`Job completed with result ${result}`);
});

videoQueue.on("failed", (job, err) => {
  error(`Job failed with error ${err}`);
});

videoQueue.on("stalled", (job) => {
  error(`Job stalled: ${job.id}`);
});

// Process video queue jobs
videoQueue.process(async (job) => {
  // const { inputPath, outputPath, effects, dimensions, metadata, convertToMp4 = false } = job.data;
  // return processVideo(inputPath, outputPath, effects, dimensions, metadata, convertToMp4);
  const { inputPath, outputPath, effects, dimensions, metadata, convertToMp4 } = job.data;
  try {
    return await processVideo(
      job,
      (progress) => {
        // Calculate and report progress
        if (progress.percent) {
          const progressPercentage = Math.round(progress.percent);
          job.progress(progressPercentage);
        }
      },
      inputPath,
      outputPath,
      effects,
      dimensions,
      metadata,
      convertToMp4,
    );
  } catch (err) {
    error("Error processing job:", job.id, err);
    throw err;
  }
});

// Check if the Bull queue is connected to the Redis server
function isQueueConnectedToRedis() {
  // info("sssssssss:", JSON.stringify(queue.client));
  info("queue connected:", videoQueue.client.connected);
  return videoQueue.client.connected;
}

// Check if Bull queue is ready
async function checkQueueReady() {
  await videoQueue.isReady();
}

module.exports = {
  videoQueue,
  isQueueConnectedToRedis,
  checkQueueReady,
};
