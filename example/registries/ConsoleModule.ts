import { Module } from '../../src';
import { ConsoleCommand } from './ConsoleCommand';
import { ConsoleService } from './ConsoleService';

export class ConsoleModule implements Module {

  /**
   * The strict interface, all other modules needs to follow.
   */
  public registries() {
    return {
      consoleCommands: (): ConsoleCommand[] => {
        return [];
      },
    };
  }

  /**
   * Triviality will combine the result consoleCommands and return it as single array.
   */
  public consoleService() {
    return new ConsoleService(
      this.registries().consoleCommands(),
    );
  }

}
