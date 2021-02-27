import { HasMiddlewares } from '.';
import { AbstractModule } from '../App/AbstractModule';
import { Config } from '../Config';
import { loadMiddlewares } from '../lib/loadMiddlewares';

/**
 * App module that is responsible for handling HTTP server configuration.
 */
export class HttpModule extends AbstractModule implements HasMiddlewares {
  public readonly name = 'http';

  public loadConfig(config: Config) {
    config.loadFromFile(__dirname + '/config');
  }

  public loadMiddlewares() {
    return loadMiddlewares(`${__dirname}/middlewares/*{.ts,.js}`);
  }
}
