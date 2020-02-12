const {ReportTransformer} = require('../../report_helpers');
const {ReportCheck, getIngestedReports} = require('../../utils');

const directory = './reports/ingested_reports';
const report = './reports/test_reports/201904.xlsx';
const rootDir = __dirname.replace('/jest/integration_tests', '');

describe('Generate Report', () => {
  describe('When the --generate_report command is ran with a file as the argument', () => {
    test('Then a CSV report will be created in the root dir of the fs using the data from the file argument', () => {
      const reportInstance = new ReportTransformer(report, directory).buildJSONReport();
      reportInstance.generateCSV();

      expect(reportInstance.report && reportInstance.directory).toBeTruthy();
      expect(reportInstance.mimeType).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    });
  });

  describe('When the --generate_report command is ran with an arbitrary file name', () => {
    test('A CSV report will be created in the root dir of the fs from the ingested data', () => {
      const fileName = 'test';
      const ingestedReports = getIngestedReports(directory, rootDir);

      const reportInstance = new ReportTransformer('', directory, fileName, ingestedReports);
      reportInstance.generateCSV();

      expect(reportInstance.mimeType).toBe(false);
      expect(new ReportCheck(rootDir).reportsExistInDir()).toBeTruthy();
    });
  });
});
