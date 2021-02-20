import * as findPackageJson from 'find-package-json';
import * as path from 'path';
import { AppModule } from './AppModule';
import { Config } from './Config';
import { loadEnvFiles } from './lib/loadEnvFiles';
import Container, { Token } from './proxy/typedi';

/**
 * Names of services registered by the application.
 */
export const AppServices = {
  Config: new Token<Config>('config'),
};

/**
 * Base application class that any application should extend from.
 */
export abstract class App {
  public readonly nodeEnv: string;

  /**
   * Application's root dir.
   */
  public readonly rootDir;

  /**
   * The project dir, usually where package.json and .env files are located.
   */
  public readonly projectDir;

  /**
   * Loaded modules.
   */
  public readonly modules: AppModule[];

  /**
   * Configuration.
   */
  public readonly config: Config;

  /**
   * Initializes the application.
   *
   * @param rootDir Path to the root of the application, usually best passed as __dirname.
   * @param modules Modules to be loaded in this application.
   */
  constructor(rootDir: string, modules: AppModule[] = []) {
    this.nodeEnv = process.env.NODE_ENV;
    this.rootDir = rootDir;
    this.projectDir = path.dirname(
      findPackageJson(this.rootDir).next().filename,
    );
    this.modules = modules;

    loadEnvFiles(this.nodeEnv, this.projectDir);

    this.config = this.initConfig();

    Container.set(AppServices.Config, this.config);
  }

  /**
   * Initializes application configuration.
   */
  private initConfig(): Config {
    const config = new Config();

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const packageJson = require(path.join(this.projectDir, 'package.json'));

    // load basic framework config
    config.loadFromObject({
      appName: packageJson.name,
      version: packageJson.version,
      rootDir: this.rootDir,
      projectDir: this.projectDir,
      env: this.nodeEnv,
    });

    // load default configs from all the modules
    this.modules.map((mod) => mod.loadConfig(config));

    return config;
  }
}