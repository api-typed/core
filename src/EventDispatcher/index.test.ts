import { EventDispatcher } from './EventDispatcher';

class TestEvent {
  constructor(public testValue: string) {}
}

class OtherEvent {
  constructor(public payload: boolean, public huh: string) {}
}

describe('Events system', (): void => {
  const eventDispatcher = new EventDispatcher();

  test('dispatching an event creates and returns it', async (): Promise<void> => {
    const event = await eventDispatcher.dispatch(TestEvent, 'create');
    expect(event).toBeInstanceOf(TestEvent);
    expect(event.testValue).toEqual('create');
  });

  test('listens for a dispatched event', async (): Promise<void> => {
    const listener = jest.fn();
    eventDispatcher.on(TestEvent, listener);

    const handler = jest.fn();
    eventDispatcher.on(TestEvent, (event) => {
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

    eventDispatcher.on(TestEvent, handler);
    eventDispatcher.on(OtherEvent, otherHandler);

    await eventDispatcher.dispatch(TestEvent, 'no-other');

    expect(handler).toHaveBeenCalled();
    expect(otherHandler).not.toHaveBeenCalled();
  });

  test('matches renamed dispatched events', async (): Promise<void> => {
    const handler = jest.fn();
    const handler2 = jest.fn();
    const RenamedTestEvent = TestEvent;

    eventDispatcher.on(TestEvent, handler);
    eventDispatcher.on(RenamedTestEvent, handler2);

    await eventDispatcher.dispatch(RenamedTestEvent, 'renamed');

    expect(handler).toHaveBeenCalled();
    expect(handler2).toHaveBeenCalled();
  });

  test('matches renamed watching events', async (): Promise<void> => {
    const handler = jest.fn();
    const handler2 = jest.fn();
    const RenamedTestEvent = TestEvent;

    eventDispatcher.on(RenamedTestEvent, handler);
    eventDispatcher.on(TestEvent, handler2);

    await eventDispatcher.dispatch(TestEvent, 'renamed');

    expect(handler).toHaveBeenCalled();
    expect(handler2).toHaveBeenCalled();
  });

  test('unregisters a handler', async (): Promise<void> => {
    const handler = jest.fn();

    eventDispatcher.on(TestEvent, handler);

    await eventDispatcher.dispatch(TestEvent, 'on');

    eventDispatcher.off(TestEvent, handler);

    await eventDispatcher.dispatch(TestEvent, 'off');

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
