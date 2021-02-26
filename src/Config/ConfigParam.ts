import Container from 'typedi';
import { AppServices } from '../App';

export function ConfigParam<T = any>(key: string, defaultValue?: T) {
  return function (object: unknown, propertyName: string, index?: number) {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: (container) =>
        container.get(AppServices.Config).get<T>(key, defaultValue),
    });
  };
}
