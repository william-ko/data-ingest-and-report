'use strict';

const chalk = require('chalk');

module.exports = error => {
  console.error(chalk.red(error.message));
  process.exit();
};
