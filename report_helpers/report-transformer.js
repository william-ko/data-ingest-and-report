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

class ReportTransfomer {
  constructor(report, directory) {
    this.report = report;
    this.directory = directory;
    this.mimeType = mime.contentType(path.extname(report));
    this.file = path.basename(report).split('.')[0];
    this.parsedReport;
  }

  buildJSONReport() {
    const workBook = xlsx.readFile(this.report);
    this.parsedReport = xlsx.utils.sheet_to_json(workBook.Sheets[workBook.SheetNames]);

    return this;
  }

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

  generateCSV() {
    const input = [];
    const skus = [];
    const sections = [];
    const units = [];
    const sales = [];

    this.parsedReport.forEach(item => {
      forIn(item, (value, key) => {
        if (key.includes('-')) {
          const year = key.split('-')[0];
          const month = key.split('-')[1].split(' ')[0];

          input.push([year, month]);
          if (key.includes('Units')) {
            units.push(value);
          } else if (key.includes('Sales')) {
            sales.push(value);
          }
        }
      });

      skus.push(item['SKU']);
      sections.push(item['Section']);
    });

    input.forEach((row, index) => {
      row.push(skus[index]);
      row.push(sections[index]);
      row.push(units[index]);
      row.push(sales[index]);
    });

    this._buildCSVFile(input);
  }

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
