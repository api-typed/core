import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Loads .env files into memory.
 *
 * @param envName Name of the environment to load. Usually NODE_ENV value.
 * @param envFilesDir Path to dir in which .env files are located.
 */
export const loadEnvFiles = (envName: string, envFilesDir: string): void => {
  const fileList = [
    `.env.${envName}.local`,
    `.env.${envName}`,
    '.env.local',
    '.env',
  ];
  fileList.forEach((fileName) => {
    dotenv.config({ path: path.resolve(envFilesDir, fileName) });
  });
};
