import {
  App,
  CommandLineModule,
  HttpModule,
  ModuleInterface,
  StandardProjectModule,
  TypeORMModule,
} from '../..';
import { ApiResourcesModule } from '../ApiResources/ApiResourcesModule';

export class StandardProjectApp extends App {
  constructor(rootDir: string, modules: ModuleInterface[] = []) {
    super(rootDir, [
      new TypeORMModule(),
      new HttpModule(),
      new ApiResourcesModule(),
      new CommandLineModule(),
      new StandardProjectModule(),
      ...modules,
    ]);
  }
}
