'use strict';

const fs = require('fs');
const path = require('path');

class ReportCheck {
  constructor(directory, file = '') {
    this.directory = directory;
    this.file = file;
  }

  reportExists() {
    return fs.existsSync(path.join(this.directory, `${this.file}.json`));
  }

  reportsExistInDir() {
    let reportsExistInDir = false;

    fs.readdirSync(this.directory).forEach(report => {
      if (report !== '.gitkeep') {
        reportsExistInDir = true;
      }
    });

    return reportsExistInDir;
  }
}

module.exports = ReportCheck;
