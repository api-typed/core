import { Service } from 'typedi';
import { ClassName } from '../lib/ClassName';

export type EventHandler<T> = (event: T) => Promise<void> | void;

type EventHandlers<T> = {
  type: ClassName<T>;
  handlers: EventHandler<T>[];
};

@Service()
export class EventSubscriber {
  private readonly eventHandlers: EventHandlers<any>[] = [];

  public on<T>(eventType: ClassName<T>, handler: EventHandler<T>): void {
    this.getEventHandlers(eventType).push(handler);
  }

  public off<T>(eventType: ClassName<T>, handler: EventHandler<T>): void {
    const metadata = this.getEventHandlersMetadata(eventType);
    metadata.handlers = metadata.handlers.filter((h) => h !== handler);
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

  public getEventHandlers<T>(
    eventType: ClassName<T>,
  ): EventHandlers<T>['handlers'] {
    return this.getEventHandlersMetadata(eventType).handlers;
  }
}
