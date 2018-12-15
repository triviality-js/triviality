import { Module } from '../../src';
import { ConsoleCommand } from './ConsoleCommand';

export class ConsoleModule implements Module {

  public registries() {
    return {
      consoleCommands: (): ConsoleCommand[] => {
        return [];
      },
    };
  }

}
