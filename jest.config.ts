import * as path from 'path';

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: path.resolve(__dirname, 'src'),
  testRegex: '.*\\.(spec|test)\\.ts$',
  transform: {
    '^.+\\.(ts|js)$': 'ts-jest',
  },
  collectCoverageFrom: ['<rootDir>/**/*.(ts|js)'],
  coverageDirectory: '<rootDir>/../coverage',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/../jest.setup.ts'],
};
