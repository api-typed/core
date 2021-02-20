/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Config } from './Config';

/**
 * Interface that every app module should fulfill.
 */
export interface AppModule {
  /**
   * Load configuration specific to the module.
   *
   * @param config Config instance on which the configuration should be loaded.
   */
  loadConfig(config: Config): void;

  /**
   * Load and return a list of controllers that this module should register.
   *
   * @param config Config instance for convenience.
   */
  loadControllers(config: Config): Function[];
}

/**
 * Convenient abstract AppModule that implements the interface with no-op methods,
 * so you don't have to.
 */
export abstract class AbstractAppModule implements AppModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public loadConfig(config: Config): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public loadControllers(config: Config): Function[] {
    return [];
  }
}
