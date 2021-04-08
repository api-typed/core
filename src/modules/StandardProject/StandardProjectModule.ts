import { AbstractModule } from '@api-typed/app';
import { Config } from '@api-typed/config';
import {
  HasControllers,
  HasMiddlewares,
  loadControllers,
  loadMiddlewares,
} from '@api-typed/http-module';
import { HasCommands } from '../../CommandLine';
import { loadCommands } from '../../lib/loadCommands';
import { HasEntities } from '../TypeORM';

export class StandardProjectModule
  extends AbstractModule
  implements HasMiddlewares, HasControllers, HasCommands, HasEntities {
  public readonly name = 'standard_project';

  public loadConfig(config: Config) {
    config.loadFromFile(__dirname + '/config');
    config.loadFromDir(config.get<string>('rootDir') + '/config');
  }

  public loadControllers(config: Config) {
    const pattern = config.get<string>('standard_project.controllers');
    return loadControllers(pattern);
  }

  public loadMiddlewares(config: Config) {
    const pattern = config.get<string>('standard_project.middlewares');
    return loadMiddlewares(pattern);
  }

  public loadCommands(config: Config) {
    const pattern = config.get<string>('standard_project.commands');
    return loadCommands(pattern);
  }

  public loadEntities(config: Config): string[] {
    const pattern = config.get<string>('standard_project.entities');
    return [pattern];
  }
}
