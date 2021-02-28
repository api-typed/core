/* eslint-disable @typescript-eslint/no-var-requires */

const [, , mode] = process.argv;

const rootDir = process.cwd();

switch (mode) {
  case 'http':
    console.log('no production http yet!');
    break;

  case 'http-dev':
    require('nodemon')({
      script: `${rootDir}/node_modules/@api-typed/framework/src/Http/run-dev.ts`,
      watch: [`${rootDir}/src/**`, `${rootDir}/.env`, `${rootDir}/.env*`],
      ext: 'ts,json',
      ignore: [`${rootDir}/src/**/*.@(test|spec).ts`],
    })
      .on('log', ({ colour }) => console.log(colour))
      .on('start', () => console.clear())
      .on('restart', () => console.clear());
    break;

  case 'cli':
  default:
    console.log('run terminal');
}
