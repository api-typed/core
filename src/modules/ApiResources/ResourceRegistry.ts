import { ClassName } from '@api-typed/common';
import { ConfigParam } from '@api-typed/config';
import { kebabCase } from 'lodash';
import * as pluralize from 'pluralize';
import { Service } from 'typedi';
import {
  ApiResourceMetaData,
  ApiResourceOptions,
  Operation,
  OperationMetaData,
} from './types';

@Service()
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
      perPage: options.perPage || 20,
      sortDefault: options.sortDefault,
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
    operations: Operation[] = ['list', 'create', 'read', 'update', 'delete'],
  ): Record<Operation, OperationMetaData> {
    return {
      list: {
        enabled: operations.includes('list'),
      },
      create: {
        enabled: operations.includes('create'),
      },
      read: {
        enabled: operations.includes('read'),
      },
      update: {
        enabled: operations.includes('update'),
      },
      delete: {
        enabled: operations.includes('delete'),
      },
    };
  }
}
