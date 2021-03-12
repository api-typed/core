import { Config } from '../Config';
import { App } from './App';

export enum AppRunMode {
  HTTP = 'http',
  Command = 'command',
}

export interface AppDelegate {
  start: () => Promise<void>;
  stop: (exitCode: number) => Promise<void>;
}

export interface ModuleInterface {
  name: string;

  /**
   * Load configuration specific to the module.
   *
   * @param config Config instance on which the configuration should be loaded.
   */
  loadConfig(config: Config): void;

  /**
   * Perform any initialization.
   *
   * Optionally return an AppDelegate that will be responsible for running the
   * app in appropriate run mode.
   *
   * One and only one registered module must register an app delegate.
   */
  init(app: App): void | Promise<void> | AppDelegate | Promise<AppDelegate>;

  /**
   * Perform any cleanup when the app is closing.
   */
  close(exitCode: number, app: App): void | Promise<void>;
}
