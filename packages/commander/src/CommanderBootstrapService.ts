import { Command } from 'commander';
import { LoggerInterface } from '@triviality/logger';
import { CommanderConfigurationInterface } from './CommanderConfigurationInterface';

/**
 * Shows errors when no valid command is found or no command given.
 */
export class CommanderBootstrapService {

  constructor(private commander: Command, private commands: Iterable<CommanderConfigurationInterface>, private logger: LoggerInterface) {
  }

  public async handle(argv: string[] = process.argv) {
    const pending: Promise<void>[] = [];
    for (const service of this.commands) {
      pending.push(Promise.resolve(service.configure(this.commander)));
    }
    await Promise.all(pending);
    this.commander.allowUnknownOption(false);
    this.commander.on('command:*', () => {
      this.logger.error('Invalid command: %s\nSee --help for a list of available commands.', this.commander.args.join(' '));
      return Promise.reject();
    });
    this.commander.parse(argv);
    if (this.commander.args.length === 0) {
      this.logger.error('No command given. \nSee --help for a list of available commands.');
      return Promise.reject();
    }
    return Promise.resolve();
  }

}
