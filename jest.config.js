module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  roots: ['utils'],
  testEnvironment: 'node',
  testMatch: [
    '**/*.+(spec|test).+(ts|js)',
  ],
}
