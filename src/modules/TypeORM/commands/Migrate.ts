import { Inject } from 'typedi';
import { Command, CommandInterface } from '../../../CommandLine';
import { TypeORMCliExecutor } from './utils/TypeORMCliExecutor';

@Command(
  'db:migrate',
  'Update database schema by running any pending migrations',
)
export class Migrate implements CommandInterface {
  constructor(
    @Inject(() => TypeORMCliExecutor)
    private readonly executor: TypeORMCliExecutor,
  ) {}

  public async run() {
    await this.executor.execStream('migration:run');
  }
}
