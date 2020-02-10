'use strict';

const {forEach, forIn, isEmpty} = require('lodash');
const {throwError} = require('../utils');

module.exports = parsedReport => {
  if (!isEmpty(parsedReport)) {
    forEach(parsedReport, section => {
      forIn(section, (value, key) => {
        const numToString = value.toString();

        // validate each numerical value in a report
        if (key !== 'Section' && !numToString.match(/^-?\d*(\.\d+)?$/)) {
          throwError({message: 'Error: Sales value in report is not a valid float'});
        }
      });
    });
  } else {
    throwError({message: 'Error: There was a problem ingesting the report'});
  }
};
