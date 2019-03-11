import { Command } from 'commander';
import { CommanderConfigurationInterface } from '../src';

export class CommanderHelloConfiguration implements CommanderConfigurationInterface {

  public async configure(program: Command) {
    program
      .command('hello <name>')
      .description('Say hello to someone')
      .option('-s, --shout', 'shout the hello message')
      .action((name, cmd: { shout: boolean }) => {
        const message = `hello ${name}`;
        console.log(cmd.shout ? message.toUpperCase() : message);
      });
  }
}
