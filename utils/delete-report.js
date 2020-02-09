'user-strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// rollback stradegy. if error deletes saved reports. if duplicate report is uploaded, deletes saved report
module.exports = (directory, file) => {
  console.log(chalk.yellow('Removing existing reports...'));

  fs.readdirSync(directory).forEach(report => {
    if (`${file}.json` === report) {
      fs.unlinkSync(path.join(directory, report));
    }
  });
};
