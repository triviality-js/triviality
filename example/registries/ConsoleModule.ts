import { Module } from '../../src';
import { ConsoleCommand } from './ConsoleCommand';
import { ConsoleService } from './ConsoleService';
import { ProcessInput } from './ProcessInput';
import { ProcessOutput } from './ProcessOutput';
import { ConsoleInput } from './ConsoleInput';
import { ConsoleOutput } from './ConsoleOutput';

export class ConsoleModule implements Module {

  public registries() {
    return {
      consoleCommands: (): ConsoleCommand[] => {
        return [];
      },
    };
  }

  public consoleService() {
    return new ConsoleService(
      this.registries().consoleCommands(),
      this.processInput(),
      this.processOutput(),
    );
  }

  public processInput(): ConsoleInput {
    return new ProcessInput();
  }

  public processOutput(): ConsoleOutput {
    return new ProcessOutput();
  }

}
