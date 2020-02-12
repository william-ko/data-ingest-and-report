'use strict';
const {log} = console;

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// rollback stradegy. if error, deletes saved reports. if duplicate report is uploaded, deletes saved report
module.exports = (directory, file, error) => {
  if (error) {
    log(chalk.yellow('Rolling-back any changes made before occurance of error...'));
  } else {
    log(chalk.yellow('Removing duplicate reports...'));
  }

  fs.readdirSync(directory).forEach(report => {
    if (`${file}.json` === report) {
      fs.unlinkSync(path.join(directory, report));
    }
  });
};
