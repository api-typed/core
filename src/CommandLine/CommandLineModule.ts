import { Config } from '@api-typed/config';
import { LogLevel } from '@api-typed/logger';
import * as chalk from 'chalk';
import { Option, program } from 'commander';
import { padEnd, upperFirst } from 'lodash';
import Container from 'typedi';
import { App, AppDelegate, AppRunMode } from '../App';
import { AbstractModule } from '../App/AbstractModule';
import { getRegisteredCommands } from './decorators/Command';
import { CommandInterface, CommandOption, HasCommands } from './types';

/**
 * App module that is responsible for handling CLI configuration.
 */
export class CommandLineModule extends AbstractModule implements AppDelegate {
  public readonly name = 'command';

  private readonly program = program;

  private app: App;

  public loadConfig(config: Config) {
    const verbose =
      process.argv.includes('-vvv') || process.argv.includes('--verbose');
    config.loadFromObject({
      log_level: verbose
        ? LogLevel.debug
        : process.env.LOG_LEVEL_CLI || LogLevel.info,
    });
  }

  public init(app: App): void | AppDelegate {
    this.app = app;

    this.program
      .addHelpText('beforeAll', `${this.getBanner()}\n`)
      .configureOutput({
        writeErr: (str) => {
          const clear = str.trim().replace(/^error: /i, '');
          this.writeError(upperFirst(clear));
        },
      })
      .addOption(
        new Option(
          '-vvv, --verbose',
          'set log level to debug regardless of config setting',
        ),
      )
      .exitOverride(async (error) => {
        app.stop(error.exitCode);
      });

    app.loadFromModules<HasCommands, Function>('loadCommands');
    getRegisteredCommands().map((cmd) =>
      this.registerCommand(
        cmd.target,
        cmd.signature,
        cmd.description,
        cmd.options,
      ),
    );

    if (app.getRunMode() === AppRunMode.Command) {
      return this;
    }
  }

  public async start(): Promise<void> {
    try {
      await this.program.parseAsync(process.argv);
    } catch (e) {
      this.writeError(e.stack || e);
    }
  }

  public async stop(exitCode = 0): Promise<void> {
    process.exit(exitCode);
  }

  public registerCommand<TFunction extends Function>(
    target: TFunction,
    signature: string,
    description?: string,
    options?: Record<string, CommandOption | string>,
  ): void {
    Container.set({
      type: target,
    });

    const cmd = this.program.command(signature);

    if (description) {
      cmd.description(description);
    }

    Object.entries(options || {}).map(([name, opt]) => {
      if (typeof opt === 'string') {
        cmd.addOption(new Option(`${opt}, --${name}`));
        return;
      }

      const option = new Option(
        [
          opt.short && `-${opt.short},`,
          `--${name}`,
          opt.value === 'required' && `<value${opt.variadic ? '...' : ''}>`,
          opt.value === 'optional' && `[value${opt.variadic ? '...' : ''}]`,
        ]
          .filter(Boolean)
          .join(' '),
        opt.description,
      );

      if (opt.choices) {
        option.choices(opt.choices);
      }

      if (opt.default) {
        option.default(opt.default, opt.defaultDescription);
      }

      cmd.addOption(option);
    });

    cmd.action(async (...args) => {
      await this.exec(
        cmd.name(),
        Container.get<CommandInterface>(target),
        args.slice(0, args.length - 1),
      );
    });
  }

  private async exec(
    signature: string,
    cmd: CommandInterface,
    args: any[],
  ): Promise<void> {
    console.log(this.getBanner());
    console.log(` ${chalk.yellow(signature)}`);
    console.log(' ');

    let exitCode = await cmd.run(...args);
    exitCode = exitCode || 0;

    console.log('');
    console.log(
      [
        chalk.yellow('Finished with exit code'),
        exitCode > 0 ? chalk.red(exitCode) : chalk.green(exitCode),
      ].join(' '),
    );

    await this.app.stop(exitCode);
  }

  private getBanner(): string {
    return [
      chalk.green(this.app.config.get('appName')),
      `(v. ${this.app.config.get('version')})`,
    ].join(' ');
  }

  private writeError(str: string): void {
    const lines = str.split('\n');
    const maxLength = Math.max(...lines.map((l) => l.length)) + 2;
    console.log('');
    console.log(chalk.bgRed.white(padEnd('', maxLength)));
    lines.map((line) =>
      console.log(chalk.bgRed.white(padEnd(` ${line}`, maxLength))),
    );
    console.log(chalk.bgRed.white(padEnd('', maxLength)));
    console.log('');
  }
}
