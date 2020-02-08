'use strict';

const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const argv = require('minimist')(process.argv.slice(2));
const {ingestReport} = require('./ingest_helpers');
const {throwError, deleteReport} = require('./utils');

const acceptedMimeTypes = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain; charset=utf-8',
];

if (argv.ingest) {
  // this allows a filepath or just the filename to be passed in
  const report = argv.ingest.includes('/') ? argv.ingest : path.join(__dirname, argv.ingest);
  const mimeType = mime.contentType(path.extname(report));

  if (!acceptedMimeTypes.includes(mimeType)) {
    throwError({message: 'Error: Only .xlsx & .txt can be ingested'});
  }

  const directory = './ingested_sales_reports';
  const file = path.basename(report).split('.')[0];
  const reportExists = fs.existsSync(path.join(directory, `${file}.json`));

  try {
    ingestReport(report, reportExists, directory, file);
  } catch (error) {
    if (reportExists && error.code !== 'ENOENT') {
      deleteReport(directory, file);
    }

    throwError({message: error});
  }
} else if (argv.summary) {
  console.log
}
