import * as glob from 'glob';
import { get, merge } from 'lodash';

/**
 * Holds application configuration that can be loaded from files.
 */
export class Config {
  /**
   * Holds all the configuration.
   */
  private readonly params: Record<string, any> = {};

  /**
   * All the loaded config files.
   */
  private loadedFiles: string[] = [];

  /**
   * Loads all files in the given folder as config files and merges them with
   * the existing configuration.
   *
   * Looks for JS, TS and JSON files.
   *
   * @param configDir Path to a config directory.
   */
  public loadFromDir(configDir: string): void {
    glob.sync(`${configDir}/**/*{.js,.ts,.json}`).map((filePath) => {
      this.loadFromFile(filePath);
    });
  }

  /**
   * Loads configuration from file and merges it with the existing configuration.
   *
   * @param filePath Path to a config file. Best to omit extension if it's
   *                 a TypeScript file so it can be loaded after compilation too.
   */
  public loadFromFile(filePath: string): void {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const loadedFile = require(filePath);

    this.loadFromObject(loadedFile.default || loadedFile);

    this.loadedFiles.push(filePath);
  }

  /**
   * Merges the passed object with the existing configuration.
   *
   * @param obj Configuration object.
   */
  public loadFromObject(obj: Record<string, any>): void {
    merge(this.params, obj);
  }

  /**
   * Return a configuration parameter.
   *
   * @param key Param name. Use dot notation to access nested params.
   * @param defaultValue Default value if not found.
   */
  public get<T = any>(key: string, defaultValue?: T): T {
    let param = get(this.params, key, defaultValue);

    // resolve <references>
    if (typeof param === 'string') {
      param = param.replace(/<([\w\d.]+)>/g, (match, refName) => {
        const resolved = this.get(refName);
        if (!['string', 'number', 'undefined'].includes(typeof resolved)) {
          throw new Error(
            `Cannot reference non-scalar param "${refName}" while getting "${key}" config param.`,
          );
        }
        return resolved;
      });
    }

    return param;
  }
}
