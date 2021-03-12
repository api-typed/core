import { Config } from '../Config';

export interface CommandInterface {
  run(...args: any[]): Promise<number | void>;
}

export interface CommandOption {
  short?: string;
  description?: string;
  value?: 'required' | 'optional';
  default?: any;
  defaultDescription?: string;
  choices?: string[];
  variadic?: boolean;
}

export interface HasCommands {
  /**
   * Load and return a list of commands that this module should register.
   *
   * @param config Config instance for convenience.
   */
  loadCommands(config: Config): Function[];
}
