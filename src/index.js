'use strict';

const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const argv = require('minimist')(process.argv.slice(2));
const {ingestXlsx} = require('./ingest_helpers');
const {throwError, deleteReport} = require('./utils');

const directory = './ingested_sales_reports';
const file = 'report.json';
const reportExists = fs.existsSync(path.join(directory, 'report.json'));

const acceptedMimeTypes = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain; charset=utf-8',
];

if (argv.ingest) {
  // this allows a filepath or filename to be passed in
  const report = argv.ingest.includes('/') ? argv.ingest : path.join(__dirname, argv.ingest);
  const mimeType = mime.contentType(path.extname(report));

  if (!acceptedMimeTypes.includes(mimeType)) {
    throwError({message: 'Error: Only .xlsx & .txt can be ingested'});
  }

  try {
    if (path.extname(report) === '.xlsx') {
      ingestXlsx(report, reportExists, directory, file);
    } else {
      console.log('ingest .txt');
    }
  } catch (error) {
    if (reportExists) {
      deleteReport(directory, file);
    }
    throwError({message: error});
  }
}
