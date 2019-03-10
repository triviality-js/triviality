import { ConsoleInput } from './ConsoleInput';
import { ConsoleOutput } from './ConsoleOutput';

export interface ConsoleCommand {

  name(): string;

  execute(input: ConsoleInput, output: ConsoleOutput): void | Promise<void>;
}
