import { ConsoleCommand } from './ConsoleCommand';
import { ConsoleInput } from './ConsoleInput';
import { ConsoleOutput } from './ConsoleOutput';

export class ConsoleService {

  private commandMap: { [name: string]: ConsoleCommand } = {};

  constructor(commands: ConsoleCommand[],
              private input: ConsoleInput,
              private output: ConsoleOutput) {
    commands.forEach((command) => {
      command.names().forEach((name) => {
        this.commandMap[name] = command;
      });
    });
  }

  public async handle() {
    const name = this.input.getArg(0, '');
    if (!this.commandMap[name]) {
      this.output.error(`Missing command for ${name}`);
      return;
    }
    await this.commandMap[name].execute(this.input, this.output);
  }

}
