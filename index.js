'use strict';

const path = require('path');
const mime = require('mime-types');
const argv = require('minimist')(process.argv.slice(2));
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
}
