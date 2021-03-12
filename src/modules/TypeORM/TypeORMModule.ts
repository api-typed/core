import Container from 'typedi';
import { Connection, createConnection, useContainer } from 'typeorm';
import { AbstractModule, App } from '../../App';
import { HasCommands } from '../../CommandLine';
import { Config } from '../../Config';
import { GenerateMigration } from './commands/GenerateMigration';
import { Migrate } from './commands/Migrate';
import { Revert } from './commands/Revert';
import { HasEntities, HasEntitySubscribers } from './types';

export class TypeORMModule extends AbstractModule implements HasCommands {
  public readonly name = 'typeorm';

  private entities: string[] = [];

  private migrations: string[] = [];

  private subscribers: (Function | string)[] = [];

  private connection: Connection;

  public loadConfig(config: Config): void {
    config.loadFromFile(__dirname + '/config');
  }

  public loadCommands() {
    return [GenerateMigration, Migrate, Revert];
  }

  public async init(app: App): Promise<void> {
    const options = app.config.getRequired('typeorm.connection', [
      'type',
      'hostname',
      'port',
      'username',
      'password',
      'database',
    ]);

    useContainer(Container);

    this.entities = app.loadFromModules<HasEntities, string>('loadEntities');
    this.migrations = [app.config.getRequired('typeorm.migrations')];
    this.subscribers = app.loadFromModules<HasEntitySubscribers>(
      'loadEntitySubscribers',
    );

    this.connection = await createConnection({
      ...options,
      entities: this.entities,
      migrations: this.migrations,
      subscribers: this.subscribers,
    });
  }

  public async close(): Promise<void> {
    await this.connection.close();
  }

  public getEntities(): string[] {
    return this.entities;
  }

  public getMigrations(): string[] {
    return this.migrations;
  }

  public getSubscribers(): (Function | string)[] {
    return this.subscribers;
  }
}
