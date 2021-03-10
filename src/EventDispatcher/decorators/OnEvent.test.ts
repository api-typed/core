import Container from 'typedi';
import { EventDispatcher } from '../EventDispatcher';
import { OnEvent } from './OnEvent';

class TestEvent {}

describe('@OnEvent()', (): void => {
  const eventDispatcher = Container.get(EventDispatcher);

  test('register event listener by using @OnEvent method decorator', async (): Promise<void> => {
    const fn = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class TestListener {
      @OnEvent(TestEvent)
      public onTest(event: TestEvent) {
        fn(event);
      }
    }

    await eventDispatcher.dispatch(TestEvent);
    expect(fn).toHaveBeenCalled();
  });
});
