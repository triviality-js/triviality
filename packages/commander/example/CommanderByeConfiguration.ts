import { Command } from 'commander';
import { CommanderConfigurationInterface } from '../src';

export class CommanderByeConfiguration implements CommanderConfigurationInterface {

  public async configure(program: Command) {
    program
      .command('bye <name>')
      .description('Say bye to someone')
      .option('-s, --shout', 'shout the bye message')
      .action((name, cmd: { shout: boolean }) => {
        const message = `bye ${name}`;
        console.log(cmd.shout ? message.toUpperCase() : message);
      });
  }
}
