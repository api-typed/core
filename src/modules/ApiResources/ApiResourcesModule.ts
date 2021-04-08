import { AbstractModule } from '@api-typed/app';
import { Config } from '@api-typed/config';
import { HasControllers } from '@api-typed/http-module';
import Container from 'typedi';
import { ResourceController } from './ResourceController';
import { ResourceRegistry } from './ResourceRegistry';

export class ApiResourcesModule
  extends AbstractModule
  implements HasControllers {
  public readonly name = 'api_resources';

  public loadConfig(config: Config) {
    config.loadFromDir(`${__dirname}/config`);
  }

  public loadControllers() {
    return Container.get(ResourceRegistry)
      .getResources()
      .map(ResourceController.create);
  }
}
