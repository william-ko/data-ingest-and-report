'use-strict';

const {forIn} = require('lodash');
const {throwError, deleteReport} = require('../utils');

const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');
const chalk = require('chalk');
const mime = require('mime-types');
const stringify = require('csv-stringify');
const validateReportValues = require('./validate-report-values');

/**
 * Takes a report passed in from the command line and transforms it into JSON
 * exposing a group of methods for operations on the data
 *
 * @class ReportTransformer
 */

class ReportTransfomer {
  /**
   * @param report - the xlsx or txt report passed in from cli
   * @param directory - the directory of ingested files
   */

  constructor(report, directory) {
    this.report = report;
    this.directory = directory;
    this.mimeType = mime.contentType(path.extname(report));
    this.file = path.basename(report).split('.')[0];
    this.parsedReport;
  }

  /**
   * Parses the report, stamps itself with the JSON, and returns the instance
   *
   * @access public
   */
  buildJSONReport() {
    const workBook = xlsx.readFile(this.report);
    this.parsedReport = xlsx.utils.sheet_to_json(workBook.Sheets[workBook.SheetNames]);

    return this;
  }

  /**
   * Passes the parsed report through a validator, upon passing, writes it to the fs as a JSON file
   *
   * @access public
   * @param reportExists - boolean indicatiing whether or not the given report exists in the fs
   */
  ingestReport(reportExists) {
    validateReportValues(this.parsedReport);

    if (reportExists) {
      deleteReport(this.directory, this.file);
    }

    fs.writeFile(`${this.directory}/${this.file}.json`, JSON.stringify(this.parsedReport), 'utf-8', error => {
      if (error) {
        throwError({message: error});
      }

      console.log(chalk.green('Success'));
    });
  }

  /**
   * Sorts the data by name
   *
   * @access private
   */
  _sortReportData(parsedReport) {
    return parsedReport.sort((a, b) => (a['Section'] > b['Section'] ? 1 : b['Section'] > a['Section'] ? -1 : 0));
  }

  /**
   * Creates a CSV file with custom columns given a xlsx or txt report file
   *
   * @access public
   */
  generateCSV() {
    const input = [];
    const sortedData = this._sortReportData(this.parsedReport);

    sortedData.forEach(item => {
      forIn(item, (value, key) => {
        let year;
        let month;

        if (key.includes('Sales')) {
          year = key.split('-')[0];
          month = key.split('-')[1].split(' ')[0];
        }

        if (year && month) {
          input.push([
            year,
            month,
            item['SKU'],
            item['Section'],
            item[`${year}-${month} Units`],
            item[`${year}-${month} Gross Sales`],
          ]);
        }
      });      
    });

    this._buildCSVFile(input);
  }

  /**
   * Uses the csv-stringify Node module to structure the file and write it to the root dir of the fs
   *
   * @access private
   * @param input - the columns and rows of the csv as nested arrays
   */
  _buildCSVFile(input) {
    stringify(
      input,
      {
        header: true,
        columns: {year: 'Year', month: 'Month', sku: 'SKU', category: 'Category', units: 'Units', sales: 'Gross Sales'},
      },
      (error, output) => {
        if (error) {
          throwError({message: error});
        }

        fs.writeFile(`${this.file}.csv`, output, error => {
          if (error) {
            throwError({message: error});
          }

          console.log(chalk.blueBright('csv report saved in projects root directory'));
        });
      }
    );
  }
}

module.exports = ReportTransfomer;
