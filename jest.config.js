module.exports = {
  roots: ['.'],
  verbose: true,
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'test-reports/test-coverage',
  testTimeout: 80000,
  reporters: [
    'default',
    [
      './node_modules/jest-html-reporter',
      {
        pageTitle: 'Ingestion App Test Report',
        outputPath: 'test-reports/test/index.html',
      },
    ],
  ],
  coverageReporters: ['html'],
};
