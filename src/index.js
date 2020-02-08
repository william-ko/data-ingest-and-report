'use strict';

const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');
const chalk = require('chalk');
const mime = require('mime-types');
const {isEmpty} = require('lodash');
const argv = require('minimist')(process.argv.slice(2));

const ingestedFilePath = '../ingested_sales_reports/report.json';
const reportExists = fs.existsSync(ingestedFilePath);
const acceptedMimeTypes = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain; charset=utf-8',
];

if (argv.ingest) {
  if (reportExists) {
    const directory = '../ingested_sales_reports';

    fs.readdir(directory, (err, files) => {
      if (err) throw err;

      files.forEach(file => {
        fs.unlink(path.join(directory, file), err => {
          if (err) {
            console.error(chalk.red('Error: Probem removing existing files upon ingestion'));
            process.exit();
          }
        });
      });
    });
  }
  const report = argv.ingest;
  const mimeType = mime.contentType(path.extname(report));

  if (!acceptedMimeTypes.includes(mimeType)) {
    console.error(chalk.red('Error: Only .xlsx & .txt can be ingested'));
    process.exit();
  }

  try {
    const workBook = xlsx.readFile(report);
    const sheetNameList = workBook.SheetNames;
    const parsedReport = xlsx.utils.sheet_to_json(workBook.Sheets[sheetNameList]);

    if (!isEmpty(parsedReport)) {
      fs.writeFile('../ingested_sales_reports/report.json', JSON.stringify(parsedReport), 'utf-8', err => {
        if (err) {
          console.error(chalk.red('Error: Problem saving file'));
          process.exit();
        }

        console.log(chalk.green('Success'));
      });
    }
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit();
  }
}
