import { Config } from '../Config';

export interface HasControllers {
  /**
   * Load and return a list of controllers that this module should register.
   *
   * @param config Config instance for convenience.
   */
  loadControllers(config: Config): Function[];
}

export interface HasMiddlewares {
  /**
   * Load and return a list of middlewares from this module that should be
   * applied globally.
   *
   * @param config Config instance for convenience.
   */
  loadMiddlewares(config: Config): Function[];
}
