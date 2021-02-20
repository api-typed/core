import { AbstractAppModule } from '../AppModule';
import { Config } from '../Config';
import { loadControllers } from '../lib/loadControllers';

export class StandardAppModule extends AbstractAppModule {
  public loadConfig(config: Config) {
    config.loadFromFile(__dirname + '/config');
    config.loadFromDir(config.get<string>('rootDir') + '/config');
  }

  public loadControllers(config: Config) {
    const pattern = config.get<string>('standard_app.controllers');
    return loadControllers(pattern);
  }
}
