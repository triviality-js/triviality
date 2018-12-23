import { ConsoleCommand } from './ConsoleCommand';
import { ConsoleInput } from './ConsoleInput';
import { ConsoleOutput } from './ConsoleOutput';
import { ProcessInput } from './ProcessInput';
import { ProcessOutput } from './ProcessOutput';

export class ConsoleService {

  private commandMap: { [name: string]: ConsoleCommand } = {};

  constructor(commands: ConsoleCommand[],
              private input: ConsoleInput = new ProcessInput(),
              private output: ConsoleOutput = new ProcessOutput()) {
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
