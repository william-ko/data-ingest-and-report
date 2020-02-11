const fs = require('fs');
const path = require('path');

module.exports = directories => {
  directories.forEach(dir => {
    fs.readdirSync(dir).forEach(report => {
      if (report.includes('.csv') || (dir === './reports/ingested_reports' && report !== '.gitkeep')) {
        fs.unlinkSync(path.join(dir, report));
      }
    });
  });
};
