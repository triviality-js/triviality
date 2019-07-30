import { ByeConsoleCommand } from '../../registries/Command/ByeConsoleCommand';
import { registerConsoleCommands } from '../ConsoleFeature';

export function createByeConsoleCommand() {
  return new ByeConsoleCommand();
}

export const ByeConsoleFeature = ({ byeConsoleCommand }: { byeConsoleCommand: typeof createByeConsoleCommand }) => ({
  registries: () => ({
    ...registerConsoleCommands([byeConsoleCommand()]),
  }),

  byeConsoleCommand: createByeConsoleCommand,
});
