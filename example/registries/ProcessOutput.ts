import { ConsoleOutput } from './ConsoleOutput';
import * as os from 'os';

export class ProcessOutput implements ConsoleOutput {
  public info(...message: string[]): void {
    process.stdout.write(message.join(' ') + os.EOL);
  }

  public error(...message: string[]): void {
    process.stderr.write(message.join(' ') + os.EOL);
  }
}
