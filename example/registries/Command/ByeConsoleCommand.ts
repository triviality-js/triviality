import { ConsoleInput } from '../ConsoleInput';
import { ConsoleOutput } from '../ConsoleOutput';
import { ConsoleCommand } from '../ConsoleCommand';

export class ByeConsoleCommand implements ConsoleCommand {

  public names(): string[] {
    return ['bye'];
  }

  public execute(input: ConsoleInput, output: ConsoleOutput) {
    output.info('Bye', input.getArg(1, ''), '!!!');
  }
}
