import { AbstractAppModule } from '../AppModule';
import { Config } from '../Config';

/**
 * App module that is responsible for handling HTTP server configuration.
 */
export class HttpModule extends AbstractAppModule {
  public loadConfig(config: Config): void {
    config.loadFromFile(__dirname + '/config');
  }
}
