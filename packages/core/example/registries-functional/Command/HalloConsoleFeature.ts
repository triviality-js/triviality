import { HalloConsoleCommand } from '../../registries/Command/HalloConsoleCommand';
import { registerConsoleCommands } from '../ConsoleFeature';

export function createHalloConsoleCommand() {
  return new HalloConsoleCommand();
}

export const HalloConsoleFeature = ({ halloConsoleCommand }: { halloConsoleCommand: typeof createHalloConsoleCommand }) => ({
  registries: () => ({
    ...registerConsoleCommands([halloConsoleCommand()]),
  }),

  halloConsoleCommand: createHalloConsoleCommand,
});
