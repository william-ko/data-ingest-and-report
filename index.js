'use strict';

const fs = require('fs');
const xlsx = require('xlsx');
const stringify = require('csv-stringify');
const path = require('path');
const mime = require('mime-types');
const argv = require('minimist')(process.argv.slice(2));
const {forIn, flatten} = require('lodash');
const {ingestReport} = require('./ingest_helpers');
const {validateSummaryArgs, Summarizer} = require('./summary_helpers');
const {throwError, deleteReport, ReportCheck} = require('./utils');

const directory = './reports/ingested_reports';
const acceptedMimeTypes = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain; charset=utf-8',
];

if (argv.ingest) {
  try {
    const report = argv.ingest.includes('/') ? argv.ingest : path.join(__dirname, argv.ingest);
    const mimeType = mime.contentType(path.extname(report));

    if (!acceptedMimeTypes.includes(mimeType)) {
      throwError({message: 'Error: Only .xlsx & .txt files can be ingested'});
    }

    const file = path.basename(report).split('.')[0];
    const reportExists = new ReportCheck(directory, file).reportExists();

    ingestReport(report, reportExists, directory, file);
  } catch (error) {
    // guard against files being deleted if error and no changes took place
    if (reportExists && error.code !== 'ENOENT') {
      deleteReport(directory, file, error);
    }

    throwError({message: error});
  }
} else if (argv.summary) {
  const summaryArgs = validateSummaryArgs(argv._, argv.summary);
  const reportsInSystem = new ReportCheck(directory).reportsExistInDir();

  if (reportsInSystem) {
    new Summarizer(summaryArgs, directory, __dirname).summarize();
  } else {
    throwError({message: 'Data not available'});
  }
} else if (argv.generate_report) {
  const report = argv.generate_report.includes('/') ? argv.generate_report : path.join(__dirname, argv.generate_report);
  const mimeType = mime.contentType(path.extname(report));

  const workBook = xlsx.readFile(report);
  const sheetNameList = workBook.SheetNames;
  const data = xlsx.utils.sheet_to_json(workBook.Sheets[sheetNameList]);

  if (!acceptedMimeTypes.includes(mimeType)) {
    throwError({message: 'Error: Only .xlsx & .txt files can be ingested'});
  }

  const file = path.basename(report).split('.')[0];
  const input = [];

  const skus = [];
  const sections = [];
  const units = [];
  const sales = []

  data.forEach(item => {
    forIn(item, (value, key) => {
      if (key.includes('-')) {
        input.push([key.split('-')[0], key.split('-')[1].split(' ')[0]]);

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

  stringify(
    input,
    {
      header: true,
      columns: {year: 'Year', month: 'Month', sku: 'SKU', category: 'Category', units: 'Units', sales: 'Gross Sales'},
    },
    (error, output) => {
      if (error) {
        throwError({message: error});
      };

      fs.writeFile(`${file}.csv`, output, error => {
        if (error) {
          throwError({message: error});
        };

        console.log('csv report saved in projects root directory');
      });
    }
  );
} else if (argv.exit) {
  fs.readdirSync(directory).forEach(report => {
    if (report !== '.gitkeep') {
      fs.unlinkSync(path.join(directory, report));
    }
  });
}
