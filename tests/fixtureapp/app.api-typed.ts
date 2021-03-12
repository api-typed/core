import {
  App,
  CommandLineModule,
  HttpModule,
  StandardProjectModule,
  TypeORMModule,
} from '../../src';

export default new App(__dirname, [
  new HttpModule(),
  new CommandLineModule(),
  new TypeORMModule(),
  new StandardProjectModule(),
]);
