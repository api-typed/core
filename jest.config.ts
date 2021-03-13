import * as path from 'path';
import e2eConfig from './jest.e2e.config';

const e2eTestsDir = path.resolve(__dirname, 'tests');
const isE2ETest = process.argv.some((value) => value.startsWith(e2eTestsDir));

export default isE2ETest
  ? e2eConfig
  : {
      moduleFileExtensions: ['js', 'json', 'ts'],
      rootDir: path.resolve(__dirname, 'src'),
      testRegex: '.*\\.test\\.ts$',
      transform: {
        '^.+\\.(ts|js)$': 'ts-jest',
      },
      collectCoverageFrom: ['<rootDir>/**/*.(ts|js)'],
      coverageDirectory: '<rootDir>/../coverage',
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/../jest.setup.ts'],
    };
