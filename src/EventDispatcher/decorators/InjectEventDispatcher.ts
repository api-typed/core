import Container from 'typedi';
import { EventDispatcher } from '../EventDispatcher';

export function InjectEventDispatcher(): ParameterDecorator {
  return function (object: any, propertyName: string, index?) {
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
