import { ServiceFunction } from '../../src';
import { ConsoleCommand } from '../registries/ConsoleCommand';
import { ConsoleService } from '../registries/ConsoleService';

export const createConsoleService = (commands: ServiceFunction<ConsoleCommand[]>) => () => new ConsoleService(commands());

export const registerConsoleCommands = (commands: ConsoleCommand[]) => ({
  consoleCommands: () => commands,
});

export const ConsoleFeature = ({ registries }: { registries: () => { consoleCommands: () => ConsoleCommand[] } }) => ({
  /**
   * The strict interface, all other feature needs to follow.
   */
  registries: () => ({
    ...registerConsoleCommands([]),
  }),

  /**
   * Triviality will combine the result consoleCommands and return it as single array.
   */
  consoleService: createConsoleService(registries().consoleCommands),
});
