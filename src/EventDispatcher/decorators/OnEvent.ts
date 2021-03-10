import Container from 'typedi';
import { ClassName } from '../../lib/ClassName';
import { EventDispatcher } from '../EventDispatcher';

export function OnEvent<T>(eventType: ClassName<T>): MethodDecorator {
  return function (object, methodName) {
    const eventDispatcher = Container.get(EventDispatcher);

    eventDispatcher.on(eventType, (event) => {
      const instance = Container.get(object.constructor);
      return instance[methodName](event);
    });
  };
}
