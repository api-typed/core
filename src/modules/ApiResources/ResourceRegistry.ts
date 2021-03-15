import { kebabCase } from 'lodash';
import * as pluralize from 'pluralize';
import { ConfigParam } from '../../Config';
import { ClassName } from '../../lib/ClassName';
import { ApiResourceMetaData, ApiResourceOptions } from './types';

export class ResourceRegistry {
  private readonly resources: ApiResourceMetaData[] = [];

  constructor(
    @ConfigParam<boolean>('api_resources.pluralizePaths')
    private readonly pluralizePaths = true,
  ) {}

  public register(resource: ClassName, options: ApiResourceOptions = {}): void {
    this.resources.push({
      resource,
      path: options.path || this.createPath(resource),
    });
  }

  public getResources(): ApiResourceMetaData[] {
    return this.resources;
  }

  public getResourceMetaData(resource: ClassName): ApiResourceMetaData {
    return this.resources.find((metadata) => metadata.resource === resource);
  }

  private createPath(resource: ClassName): string {
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
}
