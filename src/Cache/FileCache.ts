import * as path from 'path';
import { Service } from 'typedi';
import { ConfigParam } from '../Config';
import { deleteFile, readFile, writeFile } from '../lib/file';

@Service()
export class FileCache {
  constructor(@ConfigParam<string>('cacheDir') private readonly dir: string) {}

  public async write(filePath: string, data: string): Promise<string> {
    const fullPath = path.resolve(this.dir, filePath);
    await writeFile(fullPath, data);
    return fullPath;
  }

  public async read(filePath: string): Promise<string | undefined> {
    try {
      const fullPath = path.resolve(this.dir, filePath);
      return readFile(fullPath);
    } catch {
      return undefined;
    }
  }

  public async clear(filePath: string): Promise<void> {
    const fullPath = path.resolve(this.dir, filePath);
    await deleteFile(fullPath);
  }

  public async writeJson(
    filePath: string,
    data: Record<string, any>,
  ): Promise<string> {
    return this.write(filePath, JSON.stringify(data));
  }

  public async readJson<T = Record<string, any>>(filePath): Promise<T> {
    const data = await this.read(filePath);
    return JSON.parse(data);
  }

  public async writeObject(
    filePath: string,
    data: Record<string, any>,
  ): Promise<string> {
    return this.write(filePath, `module.exports = ${JSON.stringify(data)};`);
  }

  public async readObject<T = any>(filePath: string): Promise<T> {
    const fullPath = path.resolve(this.dir, filePath);
    return require(fullPath);
  }
}
