import Container from 'typedi';
import { EventDispatcher } from '../EventDispatcher';

export function InjectEventDispatcher() {
  return function (object: unknown, propertyName: string, index?: number) {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: (container) => {
        const dispatcher = container.get(EventDispatcher);
        return dispatcher;
      },
    });
  };
}
