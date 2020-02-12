const {Summarizer} = require('../../summary_helpers');
const directory = './reports/ingested_reports';

describe('Summary', () => {
  describe('When the --summary command is ran with the correct category, year and month arguments', () => {
    test('Then a summary for the given args will be generated', () => {
      const summary = new Summarizer(
        ['International', 2018, 12],
        directory,
        __dirname.replace('/jest/integration_tests', '')
      );

      expect(summary.args && summary.directory && summary.dirname).toBeTruthy();
      expect(summary.summarize()).toBe('International - Total Units: 36947, Total Gross Sales: 388151.38');
    });
  });
});
