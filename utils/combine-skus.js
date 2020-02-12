const {without} = require('lodash');
const sortReportData = require('./sort-report-data');

module.exports = report => {
  const sortedData = sortReportData(report, 'SKU');

  const combinedSKUs = sortedData.map((item, index, array) => {
    if (array[index + 1] && item['SKU'] === array[index + 1]['SKU']) {
      const itemKeys = Object.keys(item);
      const duplicateSKUKeys = Object.keys(array[index + 1]);

      itemKeys.forEach(key => {
        duplicateSKUKeys.forEach(dupeKey => {
          if (![dupeKey, key].includes('SKU') && ![dupeKey, key].includes('Section')) {
            if (dupeKey === key) {
              const combinedValue = item[key] + item[dupeKey];
              item[key] = combinedValue;
            }
          }
        });
      });

      return item;
    }
  });

  return combinedSKUs[0] ? without(combinedSKUs, undefined) : report;
};