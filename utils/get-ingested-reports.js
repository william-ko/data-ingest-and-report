const {without, flatMap} = require('lodash');
const fs = require('fs');

module.exports = (directory, dirname) => {
  return without(
    flatMap(fs.readdirSync(directory), report => {
      if (report !== '.gitkeep') {
        return JSON.parse(fs.readFileSync(`${dirname}/reports/ingested_reports/${report}`, 'utf8'));
      }
    }),
    undefined
  );
};
