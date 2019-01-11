import { Feature } from '../../src';
import { ConsoleCommand } from './ConsoleCommand';

export class ConsoleFeature implements Feature {

  public registries() {
    return {
      consoleCommands: (): ConsoleCommand[] => {
        return [];
      },
    };
  }

}
