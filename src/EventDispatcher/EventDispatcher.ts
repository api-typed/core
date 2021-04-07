import { ClassName } from '@api-typed/common';
import { Service } from 'typedi';

type EventHandler<T> = (event: T) => Promise<void> | void;

type EventHandlers<T> = {
  type: ClassName<T>;
  handlers: EventHandler<T>[];
};

@Service()
export class EventDispatcher {
  private readonly eventHandlers: EventHandlers<any>[] = [];

  public async dispatch<T extends new (...args: any) => any>(
    eventType: T,
    ...args: ConstructorParameters<T>
  ): Promise<InstanceType<T>> {
    const event = new eventType(...(args as any[]));

    const handlers = this.getEventHandlers<T>(eventType);
    for (const handler of handlers) {
      await handler(event);
    }

    return event;
  }

  public on<T>(eventType: ClassName<T>, handler: EventHandler<T>): void {
    this.getEventHandlers(eventType).push(handler);
  }

  public off<T>(eventType: ClassName<T>, handler: EventHandler<T>): void {
    const metadata = this.getEventHandlersMetadata(eventType);
    metadata.handlers = metadata.handlers.filter((h) => h !== handler);
  }

  public getEventHandlers<T>(
    eventType: ClassName<T>,
  ): EventHandlers<T>['handlers'] {
    return this.getEventHandlersMetadata(eventType).handlers;
  }

  private getEventHandlersMetadata<T>(
    eventType: ClassName<T>,
  ): EventHandlers<T> {
    let theEventHandlers = this.eventHandlers.find(
      (listeners) => listeners.type === eventType,
    );

    if (theEventHandlers) {
      return theEventHandlers;
    }

    theEventHandlers = {
      type: eventType,
      handlers: [],
    };

    this.eventHandlers.push(theEventHandlers);

    return theEventHandlers;
  }
}
