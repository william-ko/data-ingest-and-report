'use strict';

const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const argv = require('minimist')(process.argv.slice(2));
const {ingestReport} = require('./ingest_helpers');
const {validateSummaryArgs} = require('./summary_helpers');
const {throwError, deleteReport} = require('./utils');

let reportExists;
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

    const directory = '.reports/ingested_reports';
    const file = path.basename(report).split('.')[0];

    reportExists = fs.existsSync(path.join(directory, `${file}.json`));

    ingestReport(report, reportExists, directory, file);
  } catch (error) {
    // will rollback changes if any took place
    // guards against files being deleted if error and no changes took place
    if (reportExists && error.code !== 'ENOENT') {
      deleteReport(directory, file);
    }

    throwError({message: error});
  }
} else if (argv.summary) {
  validateSummaryArgs(argv._, argv.summary);

}
