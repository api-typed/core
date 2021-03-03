import { AbstractModule } from '../../App';
import { HasCommands } from '../../Command';
import { Config } from '../../Config';
import { HasControllers, HasMiddlewares } from '../../http';
import { loadCommands } from '../../lib/loadCommands';
import { loadControllers } from '../../lib/loadControllers';
import { loadMiddlewares } from '../../lib/loadMiddlewares';

export class StandardAppModule
  extends AbstractModule
  implements HasMiddlewares, HasControllers, HasCommands {
  public readonly name = 'standard_app';

  public loadConfig(config: Config) {
    config.loadFromFile(__dirname + '/config');
    config.loadFromDir(config.get<string>('rootDir') + '/config');
  }

  public loadControllers(config: Config) {
    const pattern = config.get<string>('standard_app.controllers');
    return loadControllers(pattern);
  }

  public loadMiddlewares(config: Config) {
    const pattern = config.get<string>('standard_app.middlewares');
    return loadMiddlewares(pattern);
  }

  public loadCommands(config: Config) {
    const pattern = config.get<string>('standard_app.commands');
    return loadCommands(pattern);
  }
}
