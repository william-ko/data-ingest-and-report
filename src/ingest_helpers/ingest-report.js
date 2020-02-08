'use-strict';

const fs = require('fs');
const xlsx = require('xlsx');
const chalk = require('chalk');
const {isEmpty} = require('lodash');
const {throwError, deleteReport, validateReportValues} = require('../utils');

module.exports = (report, reportExists, directory, file) => {
  const workBook = xlsx.readFile(report);
  const sheetNameList = workBook.SheetNames;
  const parsedReport = xlsx.utils.sheet_to_json(workBook.Sheets[sheetNameList]);

  validateReportValues(parsedReport);

  if (reportExists) {
    deleteReport(directory, file);
  }

  if (!isEmpty(parsedReport)) {
    fs.writeFile(`./ingested_sales_reports/${file}.json`, JSON.stringify(parsedReport), 'utf-8', error => {
      if (error) {
        throwError({message: error});
      }

      console.log(chalk.green('Success'));
    });
  } else {
    throwError({message: 'Error: There was a problem ingesting the report'});
  }
};
