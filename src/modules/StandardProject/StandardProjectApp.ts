import { App, ModuleInterface } from '@api-typed/app';
import { CommandLineModule } from '@api-typed/command-line';
import { HttpModule } from '@api-typed/http-module';
import { TypeORMModule } from '@api-typed/typeorm-module';
import { StandardProjectModule } from '../..';
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
