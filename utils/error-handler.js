'use strict';
const {log} = console;
const chalk = require('chalk');

module.exports = error => {
  log(chalk.red(error.message));
  process.exit();
};
