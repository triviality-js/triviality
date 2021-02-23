import { ConsoleCommand } from './ConsoleCommand';
import { ConsoleInput } from './ConsoleInput';
import { ConsoleOutput } from './ConsoleOutput';
import { ProcessInput } from './ProcessInput';
import { ProcessOutput } from './ProcessOutput';

export class ConsoleService {

  private commandMap = new Map<string, ConsoleCommand>();

  constructor(commands: ConsoleCommand[],
              private input: ConsoleInput = new ProcessInput(),
              private output: ConsoleOutput = new ProcessOutput()) {
    commands.forEach((command) => {
      this.commandMap.set(command.name(), command);
    });
  }

  public async handle() {
    const name = this.input.getArg(0, '');
    if (name.trim() === '') {
      this.output.info('No command given');
      return;
    }
    const command = this.commandMap.get(name);
    if (!command) {
      this.output.error(`Missing command for ${name}`);
      return;
    }
    await command.execute(this.input, this.output);
  }

}
