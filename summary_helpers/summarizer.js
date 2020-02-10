'use strict';

const fs = require('fs');
const chalk = require('chalk');
const {flatMap, without, get, forIn, isArray} = require('lodash');
const {throwError} = require('../utils');

class Summarizer {
  constructor(args = [], directory = '', dirname = '') {
    this.args = args;
    this.directory = directory;
    this.dirname = dirname;
  }

  _errorIfEmpty(value) {
    value = isArray(value) ? value[0] : value;

    if (!value) {
      throwError({message: 'Data not available'});
    }
  }

  summarize() {
    const reports = without(
      flatMap(fs.readdirSync(this.directory), report => {
        if (report !== '.gitkeep') {
          return JSON.parse(fs.readFileSync(`${this.dirname}/reports/ingested_reports/${report}`, 'utf8'));
        }
      }),
      undefined
    );

    this._errorIfEmpty(reports);
    this._getRequestedCategory(reports, this.args[0]);
  }

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
