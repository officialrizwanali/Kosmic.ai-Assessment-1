const chalk = require("chalk");

const log = (...params) => console.log(chalk.yellow(...params));
const info = (...params) => console.info(chalk.blue(...params));
const error = (...params) => console.error(chalk.red(...params));
const success = (...params) => console.log(chalk.green(...params));

module.exports = { log, info, error, success };
