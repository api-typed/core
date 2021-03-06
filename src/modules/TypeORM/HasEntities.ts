/* eslint-disable @typescript-eslint/ban-types */
import { Config } from '../../Config';

export interface HasEntities {
  /**
   * Load and return a list of entities that this module should register.
   *
   * This should return paths to files with entities or glob patterns.
   *
   * @param config Config instance for convenience.
   */
  loadEntities(config: Config): string[];
}
