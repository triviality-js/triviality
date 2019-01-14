import { Feature, Registries } from '../../../src';
import { ConsoleCommand } from '../ConsoleCommand';
import { HalloConsoleCommand } from './HalloConsoleCommand';
import { ConsoleFeature } from '../ConsoleFeature';

export class HalloConsoleFeature implements Feature {

  public registries(): Registries<ConsoleFeature> {
    return {
      consoleCommands: (): ConsoleCommand[] => {
        return [this.halloConsoleCommand()];
      },
    };
  }

  private halloConsoleCommand() {
    return new HalloConsoleCommand();
  }

}
