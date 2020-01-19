module.exports = {
  coverageDirectory: '__coverage__',
  collectCoverageFrom: [
    '**/*.{js,jsx}',
  ],
  coverageReporters: ['json', 'html'],
  setupFiles: [
    '<rootDir>/jest.init.js',
  ],
}