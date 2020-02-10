'use strict';

const {size} = require('lodash');
const throwError = require('../utils/error-handler');

module.exports = (args, category) => {
  args.unshift(category);

  // validate category as first arg
  !(typeof args[0] === 'string') ? throwError({message: 'Error: Invalid input (category) for summary command'}) : null;

  // validate year as second arg
  !(size(args[1].toString()) === 4) ? throwError({message: 'Error: Invalid input (year) for summary command'}) : null;

  // validate month as third arg
  !(args[2] >= 1 && args[2] <= 12) ? throwError({message: 'Error: Invalid input (month) for summary command'}) : null;

  return args;
};
