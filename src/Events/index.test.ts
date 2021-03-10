import { EventDispatcher } from './EventDispatcher';
import { EventSubscriber } from './EventSubscriber';

class TestEvent {
  constructor(public testValue: string) {}
}

class OtherEvent {
  constructor(public payload: boolean, public huh: string) {}
}

describe('Events system', (): void => {
  const eventSubscriber = new EventSubscriber();
  const eventDispatcher = new EventDispatcher(eventSubscriber);

  test('dispatching an event creates and returns it', async (): Promise<void> => {
    const event = await eventDispatcher.dispatch(TestEvent, 'create');
    expect(event).toBeInstanceOf(TestEvent);
    expect(event.testValue).toEqual('create');
  });

  test('listens for a dispatched event', async (): Promise<void> => {
    const listener = jest.fn();
    eventSubscriber.on(TestEvent, listener);

    const handler = jest.fn();
    eventSubscriber.on(TestEvent, (event) => {
      handler(event.testValue);
    });

    expect(listener).not.toHaveBeenCalled();
    expect(handler).not.toHaveBeenCalled();

    await eventDispatcher.dispatch(TestEvent, 'testing');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(expect.any(TestEvent));

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith('testing');
  });

  test('does not call other handlers', async (): Promise<void> => {
    const handler = jest.fn();
    const otherHandler = jest.fn();

    eventSubscriber.on(TestEvent, handler);
    eventSubscriber.on(OtherEvent, otherHandler);

    await eventDispatcher.dispatch(TestEvent, 'no-other');

    expect(handler).toHaveBeenCalled();
    expect(otherHandler).not.toHaveBeenCalled();
  });

  test('matches renamed dispatched events', async (): Promise<void> => {
    const handler = jest.fn();
    const handler2 = jest.fn();
    const RenamedTestEvent = TestEvent;

    eventSubscriber.on(TestEvent, handler);
    eventSubscriber.on(RenamedTestEvent, handler2);

    await eventDispatcher.dispatch(RenamedTestEvent, 'renamed');

    expect(handler).toHaveBeenCalled();
    expect(handler2).toHaveBeenCalled();
  });

  test('matches renamed watching events', async (): Promise<void> => {
    const handler = jest.fn();
    const handler2 = jest.fn();
    const RenamedTestEvent = TestEvent;

    eventSubscriber.on(RenamedTestEvent, handler);
    eventSubscriber.on(TestEvent, handler2);

    await eventDispatcher.dispatch(TestEvent, 'renamed');

    expect(handler).toHaveBeenCalled();
    expect(handler2).toHaveBeenCalled();
  });

  test('unregisters a handler', async (): Promise<void> => {
    const handler = jest.fn();

    eventSubscriber.on(TestEvent, handler);

    await eventDispatcher.dispatch(TestEvent, 'on');

    eventSubscriber.off(TestEvent, handler);

    await eventDispatcher.dispatch(TestEvent, 'off');

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
