module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['packages/**/*.{ts}', '!**/node_modules/**', '!**/site/**', '!**/examples/**'],
  modulePathIgnorePatterns: ['/node_modules/', 'site', 'examples'],
  testPathIgnorePatterns: ['/node_modules/', 'packages/presta'],
}
