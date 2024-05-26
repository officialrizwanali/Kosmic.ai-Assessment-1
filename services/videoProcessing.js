const { error, info } = require("../utils/logger");
const ffmpeg = require("fluent-ffmpeg");
const { isEmpty, isObject } = require("lodash");
const { videoFilterParameters } = require("../utils/video");

const processVideo = (job, onProgress, inputPath, outputPath, effects, dimensions, metadata, convertToMp4 = false) => {
  // error("=====================");
  // return true;
  // ====================
  // // Simulate video processing
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     console.log('Video processed:', { inputPath, outputPath, effects, dimensions, metadata, convertToMp4 });
  //     resolve(true);
  //   }, 2000);
  // });
  // ====================
  // // Simulate video processing with progress updates
  // return new Promise((resolve) => {
  //   const steps = 10; // Define the number of progress steps
  //   let currentStep = 0;

  //   const interval = setInterval(() => {
  //     currentStep += 1;
  //     const progress = (currentStep / steps) * 100;
  //     job.progress(progress); // Report progress

  //     console.log(`Processing step ${currentStep}/${steps}:`, {
  //       inputPath,
  //       outputPath,
  //       effects,
  //       dimensions,
  //       metadata,
  //       convertToMp4,
  //     });

  //     if (currentStep === steps) {
  //       clearInterval(interval);
  //       resolve(true); // Resolve the promise when done
  //     }
  //   }, 2000); // Simulate time taken for each step (e.g., 200ms)
  // });

  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath);

    if (effects && !isEmpty(effects) && isObject(effects)) {
      const filtersToApply = [];
      if (effects.grayscale) {
        filtersToApply.push(videoFilterParameters.grayscale.params);
        info("Applied grayscale effect");
      }
      if (effects.negate) {
        filtersToApply.push(videoFilterParameters.negate.params);
        info("Applied negate effect");
      }
      if (effects.sepia) {
        filtersToApply.push(videoFilterParameters.sepia.params);
        info("Applied sepia effect");
      }
      if (effects.blur) {
        filtersToApply.push(videoFilterParameters.blur.params);
        info("Applied blur effect");
      }
      if (effects.sharpen) {
        filtersToApply.push(videoFilterParameters.sharpen.params);
        info("Applied sharpen effect");
      }
      if (filtersToApply.length) {
        command.videoFilters(filtersToApply);
      }
    }

    if (dimensions && !isEmpty(dimensions) && isObject(dimensions) && dimensions.width && dimensions.height) {
      command.size(`${dimensions.width}x${dimensions.height}`);
      info("Resized video to:", `${dimensions.width}x${dimensions.height}`);
    }

    if (metadata && !isEmpty(metadata) && isObject(metadata)) {
      if (metadata.title) {
        command.outputOptions(`-metadata title="${metadata.title}"`);
        info("Added title to video");
      }
      if (metadata.description) {
        command.outputOptions(`-metadata comment="${metadata.description}"`);
        info("Added description to video");
      }
    }

    if (convertToMp4) {
      // Convert to MP4 format
      command.outputOptions("-c:v libx264");
      command.outputOptions("-preset medium");
      command.outputOptions("-crf 23");
      command.outputOptions("-pix_fmt yuv420p");
      info("Converted to MP4 format");
    }

    command
      .on("progress", onProgress)
      .on("end", () => resolve(outputPath))
      .on("error", reject)
      .save(outputPath);
  });
};

module.exports = { processVideo };
