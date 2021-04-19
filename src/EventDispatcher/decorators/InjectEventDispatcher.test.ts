import Container, { Service } from 'typedi';
import { EventDispatcher } from '../EventDispatcher';
import { InjectEventDispatcher } from './InjectEventDispatcher';

@Service()
class TestClass {
  constructor(
    @InjectEventDispatcher() public readonly eventDispatcher: EventDispatcher,
  ) {}
}

describe('@InjectEventDispatcher()', (): void => {
  test('injects event dispatcher', (): void => {
    const testObj = Container.get(TestClass);
    expect(testObj.eventDispatcher).toBeInstanceOf(EventDispatcher);
  });
});
