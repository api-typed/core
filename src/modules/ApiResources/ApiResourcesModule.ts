import Container from 'typedi';
import { AbstractModule } from '../../App';
import { HasControllers } from '../../Http';
import { ResourceController } from './ResourceController';
import { ResourceRegistry } from './ResourceRegistry';

export class ApiResourcesModule
  extends AbstractModule
  implements HasControllers {
  public readonly name = 'api_resources';

  public loadControllers() {
    return Container.get(ResourceRegistry)
      .getResources()
      .map(ResourceController.create);
  }
}
