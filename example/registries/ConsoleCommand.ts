import { ConsoleInput } from './ConsoleInput';
import { ConsoleOutput } from './ConsoleOutput';

export interface ConsoleCommand {

  names(): string[];

  execute(input: ConsoleInput, output: ConsoleOutput): void | Promise<void>;
}
