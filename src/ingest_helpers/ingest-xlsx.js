'use-strict';

const fs = require('fs');
const xlsx = require('xlsx');
const chalk = require('chalk');
const {isEmpty, forIn, forEach} = require('lodash');
const {throwError, deleteReport} = require('../utils');

module.exports = (report, reportExists, directory, file) => {
  const workBook = xlsx.readFile(report);
  const sheetNameList = workBook.SheetNames;
  const parsedReport = xlsx.utils.sheet_to_json(workBook.Sheets[sheetNameList]);

  forEach(parsedReport, section => {
    forIn(section, (value, key) => {
      const numToString = value.toString();

      // validate each numerical value in a report
      if (key !== 'Section' && !numToString.match(/^-?\d*(\.\d+)?$/)) {
        throwError({message: 'Error: Sales value in report is not a valid float'});
      }
    });
  });

  if (reportExists) {
    deleteReport(directory, file);
  }

  if (!isEmpty(parsedReport)) {
    fs.writeFile('./ingested_sales_reports/report.json', JSON.stringify(parsedReport), 'utf-8', error => {
      if (error) {
        throwError({message: error});
      }

      console.log(chalk.green('Success'));
    });
  }
};
