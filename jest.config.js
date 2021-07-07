module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['packages/**/*.{ts}', '!**/node_modules/**', '!**/docs/**', '!**/examples/**'],
  modulePathIgnorePatterns: ['/node_modules/', 'docs', 'examples'],
  testPathIgnorePatterns: ['/node_modules/', 'packages/presta'],
}
