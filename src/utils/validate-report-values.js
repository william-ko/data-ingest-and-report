const {forEach, forIn} = require('lodash');
const throwError = require('./error-handler');

module.exports = parsedReport => {
  forEach(parsedReport, section => {
    forIn(section, (value, key) => {
      const numToString = value.toString();

      // validate each numerical value in a report
      if (key !== 'Section' && !numToString.match(/^-?\d*(\.\d+)?$/)) {
        throwError({message: 'Error: Sales value in report is not a valid float'});
      }
    });
  });
};
