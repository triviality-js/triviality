import { LoggerInterface } from '@triviality/logger/build/LoggerInterface';
import { Command } from 'commander';

/**
 * Show errors when no command found or no command given.
 */
export class StartCommanderService {

  constructor(private commander: Command, private logger: LoggerInterface) {
  }

  public start(argv: string[] = process.argv) {
    this.commander.allowUnknownOption(false);
    this.commander.on('command:*',  () => {
      this.logger.error('Invalid command: %s\nSee --help for a list of available commands.', this.commander.args.join(' '));
      process.exit(1);
    });

    this.commander.parse(argv);
    if (this.commander.args.length === 0) {
      this.logger.error('No command given. \nSee --help for a list of available commands.');
      process.exit(1);
    }
  }

}
