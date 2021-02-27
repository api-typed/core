/* eslint-disable @typescript-eslint/ban-types */
import { Config } from '../Config';

export interface HasControllers {
  /**
   * Load and return a list of controllers that this module should register.
   *
   * @param config Config instance for convenience.
   */
  loadControllers(config: Config): Function[];
}
