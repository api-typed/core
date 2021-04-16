import { App, ModuleInterface } from '@api-typed/app';
import { CommandLineModule } from '@api-typed/command-line';
import { HttpModule } from '@api-typed/http-module';
import { ApiResourcesModule } from '../ApiResources/ApiResourcesModule';
import { StandardProjectModule, TypeORMModule } from '../..';

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
