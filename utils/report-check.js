'use strict';

const fs = require('fs');
const path = require('path');

/**
 * A simple object that exposes validation methods for report operations
 *
 * @class ReportCheck
 */

class ReportCheck {
  /**
   * @param directory - the directory of ingested files
   * @param file - the current file being ingested
   */

  constructor(directory, file = '') {
    this.directory = directory;
    this.file = file;
  }

  /**
   * Checks if a report by the given file name exists in the file-system
   *
   * @access public
   */
  reportExists() {
    return fs.existsSync(path.join(this.directory, `${this.file}.json`));
  }

  /**
   * Checks if there are any reports in the file-system
   *
   * @access public
   */
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
