import { App } from '@api-typed/app';
import { ConfigParam } from '@api-typed/config';
import { Inject, Service } from 'typedi';
import { FileCache } from '../../../../Cache';
import { TypeORMModule } from '../../TypeORMModule';

@Service()
export class ConfigDumper {
  private readonly path = 'typeorm/ormconfig.js';

  constructor(
    @Inject(() => App) private readonly app: App,
    @Inject(() => FileCache) private readonly fileCache: FileCache,
    @ConfigParam('typeorm.connection') private readonly connectionInfo,
    @ConfigParam('typeorm.migrationsDir') private readonly migrationsDir,
  ) {}

  public async dump(): Promise<string> {
    const typeormModule = this.app.getModule('typeorm') as TypeORMModule;

    const configData = {
      ...this.connectionInfo,
      entities: typeormModule.getEntities(),
      migrations: typeormModule.getMigrations(),
      cli: {
        // have to make the migration dir relative to cwd because of how
        // TypeORM uses it (cwd + / + dir), so just make it go up to the dir
        // root and in again
        migrationsDir: this.migrationsDir
          .split('/')
          .filter(Boolean)
          .reduce((path, dir) => {
            return ['..', ...path, dir];
          }, [])
          .join('/'),
      },
    };
    return this.fileCache.writeObject(this.path, configData);
  }

  public async clear(): Promise<void> {
    return this.fileCache.clear(this.path);
  }
}
