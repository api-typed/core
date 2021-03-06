import { Inject } from 'typedi';
import { Command, CommandInterface } from '../../../CommandLine';
import { TypeORMCliExecutor } from './utils/TypeORMCliExecutor';

@Command('db:revert', 'Revert database changes made by last migration run')
export class Revert implements CommandInterface {
  constructor(
    @Inject(() => TypeORMCliExecutor)
    private readonly executor: TypeORMCliExecutor,
  ) {}

  public async run() {
    await this.executor.execStream('migration:revert');
  }
}
