'use strict';

const {exit} = require('./exit_helpers');
const {ReportTransformer} = require('./report_helpers');
const {throwError, deleteReport, ReportCheck, getIngestedReports} = require('./utils');
const {validateSummaryArgs, Summarizer} = require('./summary_helpers');

const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

let file;
let reportExists;
const directory = './reports/ingested_reports';
const acceptedMimeTypes = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain; charset=utf-8',
];

if (argv.ingest) {
  /** Ingest command block **/

  try {
    const initialReport = argv.ingest.includes('/') ? argv.ingest : path.join(__dirname, argv.ingest);
    const reportInstance = new ReportTransformer(initialReport, directory).buildJSONReport();

    if (!acceptedMimeTypes.includes(reportInstance.mimeType)) {
      throwError({message: 'Error: Only .xlsx & .txt files can be ingested'});
    }

    file = reportInstance.file;
    reportExists = new ReportCheck(directory, file).reportExists();

    reportInstance.ingestReport(reportExists);
  } catch (error) {
    // guard against files being deleted if error and no changes took place
    if (reportExists && error.code !== 'ENOENT') {
      deleteReport(directory, file, error);
    }

    throwError({message: error});
  }
} else if (argv.summary) {
  /** Summary command block **/

  const summaryArgs = validateSummaryArgs(argv._, argv.summary);
  const reportsInSystem = new ReportCheck(directory).reportsExistInDir();

  if (reportsInSystem) {
    new Summarizer(summaryArgs, directory, __dirname).summarize();
  } else {
    throwError({message: 'Data not available'});
  }
} else if (argv.generate_report) {
  /** Generate Report command block **/

  const reportsInSystem = new ReportCheck(directory).reportsExistInDir();

  if (argv.generate_report.split('.')[1]) {
    const initialReport = argv.generate_report.includes('/')
      ? argv.generate_report
      : path.join(__dirname, argv.generate_report);

    const reportInstance = new ReportTransformer(initialReport, directory).buildJSONReport();

    if (!acceptedMimeTypes.includes(reportInstance.mimeType)) {
      throwError({message: 'Error: Only .xlsx & .txt files can be ingested'});
    }

    reportInstance.generateCSV();
  } else if (reportsInSystem) {
    const fileName = argv.generate_report;
    const ingestedReports = getIngestedReports(directory, __dirname);

    new ReportTransformer('', directory, fileName, ingestedReports).generateCSV();
  }
} else if (argv.exit) {
  /** Exit command block **/

  exit([directory, __dirname]);
}
