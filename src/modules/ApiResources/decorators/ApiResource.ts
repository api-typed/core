import Container from 'typedi';
import { ResourceRegistry } from '../ResourceRegistry';
import { ApiResourceOptions } from '../types';

export function ApiResource(options: ApiResourceOptions = {}): ClassDecorator {
  return function (target) {
    Container.get(ResourceRegistry).register(target as any, options);
  };
}
