const { info, error, success } = require("../utils/logger");
const { isEmpty } = require("lodash");
const { uploadDir } = require("../utils/constants");
const { videoQueue } = require("../services/queue");
const { pathExists, joinPaths } = require("../services/storage");

const processVideo = async (req, res) => {
  const { filename, outputFilename, effects, dimensions, metadata, convertToMp4 = false } = req.body;
  if (!filename) {
    error("No filename provided");
    return res.status(400).send({ error: "No filename provided" });
  }
  const inputPath = joinPaths(uploadDir, filename);
  if (!pathExists(inputPath)) {
    error("File not found at:", inputPath);
    return res.status(404).send({ error: "File not found" });
  }

  if (
    (!effects || isEmpty(effects)) &&
    (dimensions || isEmpty(dimensions)) &&
    (metadata || isEmpty(metadata)) &&
    !convertToMp4
  ) {
    return res.status(400).send({ error: "No processing options provided" });
  }

  const _outputFilename = outputFilename || `processed-${filename}`;
  const outputPath = joinPaths(uploadDir, _outputFilename);
  info("Output file path:", outputPath);

  // res.send({ message: "Success" });

  try {
    const x = await videoQueue.isReady();
    info("Queue is ready to process jobs", x);

    const job = await videoQueue.add({
      inputPath,
      outputPath,
      effects,
      dimensions,
      metadata,
      convertToMp4,
    });

    info("Job ID:", job.id);

    res.send({ jobId: job.id, message: "Video added to the processing job queue", outputFilename: _outputFilename });
  } catch (err) {
    error("Error adding job to queue:", err);
    res.status(500).send({ error: "Failed to add job to queue" });
  }

  // const job = videoQueue.add({
  //   inputPath,
  //   outputPath,
  //   effects,
  //   dimensions,
  //   metadata,
  //   convertToMp4,
  // });

  // info('Job ID:', job.id)

  // res.send({ jobId: job.id, message: "Video added to the processing job queue" });

  // info('=====================')
  // return videoQueue
  //   .add({
  //     inputPath,
  //     outputPath,
  //     effects,
  //     dimensions,
  //     metadata,
  //     convertToMp4,
  //   })
  //   .then((job) => {
  //     info("Job ID:", job.id);

  //     return res.send({ jobId: job.id, message: "Video added to the processing job queue" });
  //   });
};

const getJobProgress = async (req, res) => {
  const jobId = req.params.jobId;
  const job = await videoQueue.getJob(jobId);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  const jobState = await job.getState();

  if (jobState === "completed" || jobState === "active") {
    const progress = await job.progress();
    res.status(200).json({ jobId: jobId, progress: progress, state: jobState });
  } else {
    res.status(400).json({ error: "Job is not in processing or has not been processed yet" });
  }
};

module.exports = { processVideo, getJobProgress };
