import * as findPackageJson from 'find-package-json';
import * as path from 'path';
import Container from 'typedi';
import { Config } from '../Config';
import { loadEnvFiles } from '../lib/loadEnvFiles';
import { LogFormat, Logger, LoggerInterface, LogLevel } from '../Logger';
import { ModuleInterface } from './ModuleInterface';

/**
 * Base application class that any application should extend from.
 */
export abstract class App {
  /**
   * Application mode.
   */
  public abstract readonly mode: string;

  /**
   * Node environment.
   */
  public readonly nodeEnv: string;

  /**
   * Loaded modules.
   */
  public readonly modules: ModuleInterface[];

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
  constructor(rootDir: string, modules: ModuleInterface[] = []) {
    const packageJsonPath = findPackageJson(rootDir).next().filename;
    if (!packageJsonPath) {
      throw new Error(
        'Could not resolve path to your package.json file. Make sure to pass valid rootDir argument to the App constructor (usually __dirname).',
      );
    }

    Container.set(App, this);

    this.nodeEnv = process.env.NODE_ENV || 'development';
    this.modules = modules;

    const projectDir = path.dirname(packageJsonPath);
    const envFiles = loadEnvFiles(this.nodeEnv, projectDir);

    this.config = this.initConfig({
      rootDir,
      projectDir,
      cacheDir: path.resolve(projectDir, 'cache'),
    });
    Container.set(Config, this.config);

    this.logger = this.initLogger();
    Container.set(Logger, this.logger);

    this.logger.debug('Application initialized');
    this.logger.debug('Loaded env files', {
      data: envFiles,
    });
    this.logger.debug('Loaded modules', {
      data: this.modules.map((mod) => mod.name),
    });
  }

  /**
   * Initializes application configuration.
   */
  private initConfig(initial: Record<string, any> = {}): Config {
    const config = new Config();

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const packageJson = require(path.join(initial.projectDir, 'package.json'));

    // load basic framework config
    config.loadFromObject({
      ...initial,
      appName: packageJson.name,
      version: packageJson.version,
      env: this.nodeEnv,
      isProduction: this.nodeEnv === 'production',
      isDevelopment: this.nodeEnv === 'development',
      isTest: this.nodeEnv === 'test',
    });
    config.loadFromFile(__dirname + '/config');

    // load configs from all the modules
    this.modules.map((mod) => mod.loadConfig(config));

    config.freeze();

    return config;
  }

  /**
   * Initializes application main logger.
   */
  private initLogger(): LoggerInterface {
    return new Logger(
      this.config.get<string>('appName'),
      this.config.get<LogLevel>('log.level'),
      this.config.get<LogFormat>('log.format'),
    );
  }

  /**
   * Start the aplication.
   *
   * Calls init() method on all registered modules in sequence.
   */
  public async start(): Promise<unknown> {
    for (const mod of this.modules) {
      await mod.init(this);
    }

    return;
  }

  /**
   * Stop the application.
   *
   * Calls close() method on all registered modules in reverse sequence.
   */
  public async stop(exitCode = 0): Promise<unknown> {
    const reverseModules = [...this.modules].reverse();
    for (const mod of reverseModules) {
      await mod.close(exitCode, this);
    }

    return;
  }

  /**
   * Get a module with the given name.
   *
   * @param name Module name.
   */
  public getModule(name: string): ModuleInterface {
    const mod = this.modules.find((mod) => mod.name === name);
    if (!mod) {
      throw new Error(`Cannot find module "${name}`);
    }

    return mod;
  }

  /**
   * Get all registered modules tagged with the given interface.
   *
   * @param checkMethods Method names that MUST be implemented on the module.
   */
  public getTaggedModules<I>(checkMethods: string | string[]): I[] {
    const requiredMethods =
      typeof checkMethods === 'string' ? [checkMethods] : checkMethods;

    const hasInterface = (mod: any): mod is I => {
      return requiredMethods.every((method) => method in mod);
    };

    return this.modules.filter(hasInterface) as any[];
  }

  /**
   * Find all registered modules that are tagged with the given interface
   * and call a loader method on them (with config as the sole argument for
   * convenience).
   *
   * You SHOULD type at least the I interface.
   *
   * @param loaderMethod Name of the loader method that should be in the I interface.
   */
  public loadFromModules<I, R = Function | string>(loaderMethod: string): R[] {
    const providers: I[] = this.getTaggedModules<I>(loaderMethod);

    return providers.reduce((items, mod: I) => {
      return [...items, ...mod[loaderMethod](this.config)];
    }, []);
  }
}
