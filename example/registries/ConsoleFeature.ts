import { Feature } from '../../src';
import { ConsoleCommand } from './ConsoleCommand';
import { ConsoleService } from './ConsoleService';

export class ConsoleFeature implements Feature {

  /**
   * The strict interface, all other feature needs to follow.
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
