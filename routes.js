const { Router } = require("express");
const videoProcessingController = require("./controllers/videoProcessingController");
const storageController = require("./controllers/storageController");
const { multerUpload } = require("./middlewares/multer");

const routes = Router();

routes.post("/video/upload", multerUpload.single("video"), storageController.uploadVideo);
routes.post("/video/process", videoProcessingController.processVideo);

routes.get("/video/process/progress/:jobId", videoProcessingController.getJobProgress);

routes.post("/video/download/token", storageController.getFileDownloadToken);
routes.get("/video/download/:token", storageController.downloadFileByToken);

module.exports = routes;
