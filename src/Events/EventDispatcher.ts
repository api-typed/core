import { Inject, Service } from 'typedi';
import { EventSubscriber } from './EventSubscriber';

@Service()
export class EventDispatcher {
  constructor(
    @Inject(() => EventSubscriber)
    private readonly eventSubscriber: EventSubscriber,
  ) {}

  public async dispatch<T extends new (...args: any) => any>(
    eventType: T,
    ...args: ConstructorParameters<T>
  ): Promise<InstanceType<T>> {
    const event = new eventType(...(args as any[]));

    const handlers = this.eventSubscriber.getEventHandlers<T>(eventType);
    for (const handler of handlers) {
      await handler(event);
    }

    return event;
  }
}
