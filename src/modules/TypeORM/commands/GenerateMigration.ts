import * as chalk from 'chalk';
import * as path from 'path';
import { Inject } from 'typedi';
import { Command, CommandInterface } from '../../../CommandLine';
import { readFile, writeFile } from '../../../lib/file';
import { Migrate } from './Migrate';
import { TypeORMCliExecutor } from './utils/TypeORMCliExecutor';

@Command('db:generate-migration <name>', 'Generate database migration')
export class GenerateMigration implements CommandInterface {
  constructor(
    @Inject(() => TypeORMCliExecutor)
    private readonly executor: TypeORMCliExecutor,
    @Inject(() => Migrate)
    private readonly migrateCommand: Migrate,
  ) {}

  public async run(name: string) {
    // firstly, run the migrate command
    await this.migrateCommand.run();

    const output = await this.executor.execSync(
      `migration:generate -n ${name} --pretty`,
    );

    // gotta make some fixes to the generated migration
    if (output.endsWith('has been generated successfully.\n')) {
      const filePath = output.match(
        /Migration (.*) has been generated successfully/i,
      )[1];

      await this.fixMigrationImport(filePath);

      const fileName = path.basename(filePath);
      console.log(
        `Migration ${chalk.green(fileName)} has been generated successfully.`,
      );
      return;
    }

    // customise some outputs
    if (output.startsWith('No changes in database schema were found')) {
      console.log('Database is up to date.');
    } else {
      console.log(output);
    }
  }

  /**
   * TypeORM generates migrations that import "typeorm" module, but we want to
   * change that to our proxy import.
   *
   * @param filePath Path to the generated migration.
   */
  private async fixMigrationImport(filePath: string): Promise<void> {
    const content = await readFile(filePath);
    await writeFile(
      filePath,
      content.replace(/from "typeorm"/, 'from "@api-typed/framework/typeorm"'),
    );
  }
}
