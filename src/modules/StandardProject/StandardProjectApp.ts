import { App, ModuleInterface } from '@api-typed/app';
import {
  CommandLineModule,
  HttpModule,
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
