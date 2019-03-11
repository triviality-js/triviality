import { Feature, OptionalRegistries } from '../../../src';
import { ConsoleCommand } from '../ConsoleCommand';
import { ByeConsoleCommand } from './ByeConsoleCommand';
import { ConsoleFeature } from '../ConsoleFeature';

export class ByeConsoleFeature implements Feature {

  public registries(): OptionalRegistries<ConsoleFeature> {
    return {
      consoleCommands: (): ConsoleCommand[] => {
        return [this.byeConsoleCommand()];
      },
    };
  }

  private byeConsoleCommand() {
    return new ByeConsoleCommand();
  }

}
