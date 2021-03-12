#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const glob = require('glob');
const path = require('path');

const [, , command] = process.argv;

const rootDir = process.cwd();
const envAppFile = process.env.API_TYPED_APP_FILE;

const locateAppFile = (use = 'ts') => {
  if (!['js', 'ts'].includes(use)) {
    throw new Error('Invalid call to locateAppFile()');
  }

  const pattern = `${rootDir}/{**/,!node_modules/,}app.api-typed.${use}`;
  const files = glob.sync(pattern);

  if (files.length === 0) {
    if (use === 'js') {
      throw new Error(
        'Could not locate compiled app file for Api-Typed.\nMake sure your "app.api-typed.ts" file is getting compiled to JavaScript.',
      );
    }

    throw new Error(
      `Could not locate an app file for Api-Typed.\nPlease create "src/app.api-typed.${use}".`,
    );
  }

  return files[0];
};

let appFile;
if (envAppFile) {
  appFile = path.resolve(rootDir, envAppFile);
} else {
  appFile = locateAppFile(
    command === 'http' ||
      (command !== 'http' && process.env.NODE_ENV === 'production')
      ? 'js'
      : 'ts',
  );
}

const appRootDir = path.dirname(appFile);

switch (command) {
  case 'http':
    require('../dist/runners/http').default(appFile);
    break;

  case 'http-dev':
  case 'http-dev-fixture':
    require('nodemon')({
      script: path.resolve(__dirname, '../src/runners/http'),
      exec: 'ts-node',
      env: {
        API_TYPED_APP_FILE: appFile,
        API_TYPED_MODE: 'http-dev',
      },
      watch: [
        `${appRootDir}/**`,
        // for dev of the framework using fixture app
        command === 'http-dev-fixture' && path.resolve(__dirname, '../src/**'),
      ].filter(Boolean),
      ext: 'ts,json',
      ignore: [
        `${appRootDir}/**/*.@(test|spec).ts`,
        command === 'http-dev-fixture' &&
          path.resolve(__dirname, '../src/**/*.@(test|spec).ts'),
      ].filter(Boolean),
    })
      .on('log', ({ colour }) => console.log(colour))
      .on('start', () => {
        console.clear();
        console.log(`Starting Api-Typed App using ${appFile} ...`);
      })
      .on('restart', () => console.clear());
    break;

  default:
    require('ts-node/register');
    require('../src/runners/cli').default(appFile);
}
