import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';

export const readFile = async (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (error, data) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(data.toString());
    });
  });
};

export const writeFile = async (
  filePath: string,
  data: string,
): Promise<void> => {
  await mkdirp(path.dirname(filePath));
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
};

export const deleteFile = async (filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
};
