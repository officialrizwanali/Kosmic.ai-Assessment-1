const fs = require("node:fs");
const path = require("node:path");

const removeFile = (filePath) => fs.unlinkSync(filePath);

const pathExists = (path) => fs.existsSync(path);

const joinPaths = (...paths) => path.join(...paths);

const createDirectory = (dirPath) => fs.mkdirSync(dirPath);

module.exports = { pathExists, joinPaths, createDirectory, removeFile };
