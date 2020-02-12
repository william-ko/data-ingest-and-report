const {ReportTransformer} = require('../../report_helpers');
const {ReportCheck, deleteReport} = require('../../utils');

const directory = './reports/ingested_reports';
const report = './reports/test_reports/201904.xlsx';

describe('Ingest', () => {
  describe('When the --ingest command is ran with a correct file as the argument', () => {
    test('Then a corresponding JSON file with the proper data will be populated in /reports/ingest_reports', () => {
      const reportInstance = new ReportTransformer(report, directory).buildJSONReport();
      const file = reportInstance.file;

      const reportExists = new ReportCheck(directory, file).reportExists();

      if (reportExists) {
        deleteReport(directory, file);
      }

      reportInstance.ingestReport(reportExists);
      expect(
        reportInstance && reportInstance.file && reportInstance.parsedReport && reportInstance.mimeType
      ).toBeTruthy();
      expect(new ReportCheck(directory, file).reportExists()).toBeTruthy();
    });
  });
});
