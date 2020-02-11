'use strict';

const {throwError} = require('../utils');
const {combineSKUs} = require('../utils');
const {flatMap, without, get, forIn, isArray} = require('lodash');

const fs = require('fs');
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
    const reports = without(
      flatMap(fs.readdirSync(this.directory), report => {
        if (report !== '.gitkeep') {
          return JSON.parse(fs.readFileSync(`${this.dirname}/reports/ingested_reports/${report}`, 'utf8'));
        }
      }),
      undefined
    );

    this._errorIfEmpty(reports);

    const consolidatedReport = combineSKUs(reports);

    this._getRequestedCategory(consolidatedReport, this.args[0]);
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
      const section = get(report, 'Section');

      if (section === category) {
        return report;
      }
    });

    this._errorIfEmpty(filteredReports);
    this._calculateSummary(filteredReports);
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
          key.includes('Gross Sales') ? (totalGrossSales += value) : (totalUnits += value);
        }
      });
    });

    this._errorIfEmpty(totalUnits);

    console.log(
      chalk.blueBright(`${this.args[0]} - Total Units: ${totalUnits}, Total Gross Sales: ${totalGrossSales.toFixed(2)}`)
    );
  }
}

module.exports = Summarizer;
