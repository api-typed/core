export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: __dirname,
  testRegex: '.*\\.(spec|test)\\.ts$',
  transform: {
    '^.+\\.(ts|js)$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.(ts|js)'],
  coverageDirectory: '<rootDir>/coverage',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
