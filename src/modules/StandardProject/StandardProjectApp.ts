import {
  App,
  CommandLineModule,
  HttpModule,
  ModuleInterface,
  StandardProjectModule,
  TypeORMModule,
} from '../..';

export class StandardProjectApp extends App {
  constructor(rootDir: string, modules: ModuleInterface[] = []) {
    super(rootDir, [
      new HttpModule(),
      new CommandLineModule(),
      new TypeORMModule(),
      new StandardProjectModule(),
      ...modules,
    ]);
  }
}
