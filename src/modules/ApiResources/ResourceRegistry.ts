import { kebabCase } from 'lodash';
import * as pluralize from 'pluralize';
import { ConfigParam } from '../../Config';
import { ClassName } from '../../lib/ClassName';
import {
  ApiResourceMetaData,
  ApiResourceOptions,
  Operation,
  OperationMetaData,
} from './types';

export class ResourceRegistry {
  private readonly resources: ApiResourceMetaData[] = [];

  constructor(
    @ConfigParam<boolean>('api_resources.pluralizePaths')
    private readonly pluralizePaths = true,
  ) {}

  public register(resource: ClassName, options: ApiResourceOptions = {}): void {
    this.resources.push({
      resource,
      path: options.path || this.configurePath(resource),
      operations: this.configureOperations(options.operations),
    });
  }

  public getResources(): ApiResourceMetaData[] {
    return this.resources;
  }

  public getResourceMetaData(resource: ClassName): ApiResourceMetaData {
    return this.resources.find((metadata) => metadata.resource === resource);
  }

  private configurePath(resource: ClassName): string {
    let className = '';
    resource.toString().replace(/^class ([\w\d]+) /i, (_, resourceName) => {
      className = resourceName;
      return '';
    });

    // pluralize last word of the path
    let path = kebabCase(className);

    if (this.pluralizePaths) {
      const words = path.split('-');
      words[words.length - 1] = pluralize.plural(words[words.length - 1]);
      path = words.join('-');
    }

    return `/${path}`;
  }

  private configureOperations(
    operations: Operation[] = [
      Operation.List,
      Operation.Create,
      Operation.Read,
      Operation.Update,
      Operation.Delete,
    ],
  ): Record<Operation, OperationMetaData> {
    return {
      [Operation.List]: {
        enabled: operations.includes(Operation.List),
      },
      [Operation.Create]: {
        enabled: operations.includes(Operation.Create),
      },
      [Operation.Read]: {
        enabled: operations.includes(Operation.Read),
      },
      [Operation.Update]: {
        enabled: operations.includes(Operation.Update),
      },
      [Operation.Delete]: {
        enabled: operations.includes(Operation.Delete),
      },
    };
  }
}
