import { ConsoleCommand } from '../registries/ConsoleCommand';

export const registerConsoleCommands = (commands: ConsoleCommand[]) => ({
  consoleCommands: () => commands,
});

export const ConsoleFeature = () => ({
  /**
   * The strict interface, all other feature needs to follow.
   */
  registries: () => ({
    ...registerConsoleCommands([]),
  }),
});
