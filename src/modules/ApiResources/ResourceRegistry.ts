import { kebabCase } from 'lodash';
import * as pluralize from 'pluralize';
import { ClassName } from '../../lib/ClassName';
import { ApiResourceMetaData, ApiResourceOptions } from './types';

export class ResourceRegistry {
  private readonly resources: ApiResourceMetaData[] = [];

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
    const words = kebabCase(className).split('-');
    words[words.length - 1] = pluralize.plural(words[words.length - 1]);

    return `/${words.join('-')}`;
  }
}
