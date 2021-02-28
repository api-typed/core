/* eslint-disable @typescript-eslint/no-var-requires */
import * as fs from 'fs';
import * as path from 'path';
import { BootstrapSettings } from './BootstrapSettings';

export const load = (supportTs = false): BootstrapSettings => {
  const files = [
    path.resolve(process.cwd(), 'dist', 'bootstrap.js'),
    supportTs && path.resolve(process.cwd(), 'src', 'bootstrap.ts'),
  ].filter(Boolean);

  const settings: BootstrapSettings = files.reduce((settings, file) => {
    if (settings || !fs.existsSync(file)) {
      return settings;
    }

    return require(file).default;
  }, null);

  if (!settings) {
    throw new Error('Could not find bootstrap file');
  }

  return settings;
};
