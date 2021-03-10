import 'reflect-metadata';
import Container, { Service } from 'typedi';
import { Logger } from '../Logger';
import { LoggerInterface } from '../types';
import { InjectLogger } from './InjectLogger';

@Service()
class TestClass {
  constructor(@InjectLogger() public readonly logger: LoggerInterface) {}
}

describe('@InjectLogger', (): void => {
  test('injects logger', (): void => {
    const testObj = Container.get(TestClass);
    expect(testObj.logger).toBeInstanceOf(Logger);
  });
});
