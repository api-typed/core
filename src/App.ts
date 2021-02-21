import * as findPackageJson from 'find-package-json';
import * as path from 'path';
import { AppModule } from './AppModule';
import { Config } from './Config';
import { loadEnvFiles } from './lib/loadEnvFiles';
import { LogFormat, Logger, LoggerInterface, LogLevel } from './Logger';
import Container, { Token } from './proxy/typedi';

/**
 * Names of services registered by the application.
 */
export const AppServices = {
  App: new Token<App>('app'),
  Config: new Token<Config>('config'),
  Logger: new Token<LoggerInterface>('logger'),
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
   * Application logger.
   */
  public readonly logger: LoggerInterface;

  /**
   * Initializes the application.
   *
   * @param rootDir Path to the root of the application, usually best passed as __dirname.
   * @param modules Modules to be loaded in this application.
   */
  constructor(rootDir: string, modules: AppModule[] = []) {
    const packageJsonPath = findPackageJson(rootDir).next().filename;
    if (!packageJsonPath) {
      throw new Error(
        'Could not resolve path to your package.json file. Make sure to pass valid rootDir argument to the App constructor (usually __dirname).',
      );
    }

    Container.set(AppServices.App, this);

    this.nodeEnv = process.env.NODE_ENV || 'development';
    this.rootDir = rootDir;
    this.projectDir = path.dirname(packageJsonPath);
    this.modules = modules;

    const envFiles = loadEnvFiles(this.nodeEnv, this.projectDir);

    this.config = this.initConfig();
    Container.set(AppServices.Config, this.config);

    this.logger = this.initLogger();
    Container.set(AppServices.Logger, this.logger);

    this.logger.debug('Application initialized');
    this.logger.debug('Loaded env files', {
      data: envFiles,
    });
    this.logger.debug('Loaded modules', {
      data: this.modules.map((mod) => mod.constructor.name),
    });
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
      isProduction: this.nodeEnv === 'production',
      isDevelopment: this.nodeEnv === 'development',
      isTest: this.nodeEnv === 'test',
    });
    config.loadFromFile(__dirname + '/app.config');

    // load default configs from all the modules
    this.modules.map((mod) => mod.loadConfig(config));

    return config;
  }

  /**
   * Initializes application main logger.
   */
  private initLogger(): LoggerInterface {
    return new Logger(
      'app',
      this.config.get<LogLevel>('log.level'),
      this.config.get<LogFormat>('log.format'),
    );
  }
}
