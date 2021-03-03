import { AbstractModule } from '../App/AbstractModule';
import { Config } from '../Config';
import { LogLevel } from '../Logger';

/**
 * App module that is responsible for handling CLI configuration.
 */
export class CommandModule extends AbstractModule {
  public readonly name = 'command';

  public loadConfig(config: Config) {
    const verbose =
      process.argv.includes('-vvv') || process.argv.includes('--verbose');
    config.loadFromObject({
      log: {
        level: verbose
          ? LogLevel.debug
          : process.env.LOG_LEVEL_CLI || LogLevel.info,
      },
    });
  }
}
