'use strict';
const {log} = console;
const {forIn, isArray} = require('lodash');
const {throwError, getIngestedReports, combineSKUs} = require('../utils');

const chalk = require('chalk');

/**
 * Creates a summary from the reports with the given arguments
 *
 * @class Summarizer
 */

class Summarizer {
  /**
   * @param args - the command line arguments
   * @param directory - the directory of ingested files
   * @param dirname - the absolute path to the file to be processed
   */

  constructor(args = [], directory = '', dirname = '') {
    this.args = args;
    this.directory = directory;
    this.dirname = dirname;
  }

  /**
   * Checks if a nessecary value exists, if not, an error is thrown.
   *
   * @access private
   * @param value - result of an operation to be checked for existence
   */
  _errorIfEmpty(value) {
    value = isArray(value) ? value[0] : value;

    if (!value) {
      throwError({message: 'Data not available'});
    }
  }

  /**
   * Function exposed for use by the --summary command. Reads reports from the file-system
   * and passes them to the other methods.
   *
   * @access public
   */
  summarize() {
    // flatten the mapped results and remove any undefined values
    const reports = getIngestedReports(this.directory, this.dirname);

    this._errorIfEmpty(reports);
    return this._getRequestedCategory(combineSKUs(reports), this.args[0]);
  }

  /**
   * Filters all the reports by the category received in args
   *
   * @access private
   * @param reports - Array of the data read from the reports in the file-system
   * @param category - Requested category (or Section) in the reports by the user
   */
  _getRequestedCategory(reports, category) {
    const filteredReports = reports.filter(report => {
      const section = report['Section'];

      if (section === category) {
        return report;
      }
    });

    this._errorIfEmpty(filteredReports);
    return this._calculateSummary(filteredReports);
  }

  /**
   * Calculates the total gross sales and units of a given year and month from the reports
   *
   * @access private
   * @param filteredReports - Array of the reports filtered by category
   */
  _calculateSummary(filteredReports) {
    let totalUnits = 0;
    let totalGrossSales = 0;
    const yearAndMonth = `${this.args[1]}-${this.args[2]}`;

    filteredReports.forEach(report => {
      forIn(report, (value, key) => {
        if (key.includes(yearAndMonth)) {
          key.includes('Sales') ? (totalGrossSales += value) : (totalUnits += value);
        }
      });
    });

    this._errorIfEmpty(totalUnits);

    const completeSummary = `${this.args[0]} - Total Units: ${totalUnits}, Total Gross Sales: ${totalGrossSales.toFixed(
      2
    )}`;

    log(chalk.blueBright(completeSummary));

    return completeSummary;
  }
}

module.exports = Summarizer;
