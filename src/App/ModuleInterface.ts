import { Config } from '../Config';
import { App } from './App';

export interface ModuleInterface {
  name: string;

  /**
   * Load configuration specific to the module.
   *
   * @param config Config instance on which the configuration should be loaded.
   */
  loadConfig(config: Config): void;

  /**
   * Perform any initialization
   */
  init(app: App): void;

  /**
   * Perform any cleanup when the app is closing.
   */
  close(exitCode: number, app: App): void;
}
