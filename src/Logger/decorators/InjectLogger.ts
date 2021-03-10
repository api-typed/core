import Container from 'typedi';
import { Logger } from '../Logger';

export function InjectLogger() {
  return function (object: unknown, propertyName: string, index?: number) {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: (container) => container.get(Logger),
    });
  };
}
