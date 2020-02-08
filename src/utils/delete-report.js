'user-strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

module.exports = (directory, file) => {
  console.log(chalk.yellow('Removing existing reports...'));
  fs.readdirSync(directory).forEach(file => {
    fs.unlinkSync(path.join(directory, file));
  });
};
