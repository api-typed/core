import Container from 'typedi';
import { AppServices } from '../App';

export function InjectLogger() {
  return function (object: unknown, propertyName: string, index?: number) {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: (container) => container.get(AppServices.Logger),
    });
  };
}
