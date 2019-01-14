import { ConsoleInput } from '../ConsoleInput';
import { ConsoleOutput } from '../ConsoleOutput';
import { ConsoleCommand } from '../ConsoleCommand';

export class HalloConsoleCommand implements ConsoleCommand {

  public name(): string {
    return 'hallo';
  }

  public execute(input: ConsoleInput, output: ConsoleOutput) {
    output.info('Hallo', input.getArg(1, ''));
  }
}
