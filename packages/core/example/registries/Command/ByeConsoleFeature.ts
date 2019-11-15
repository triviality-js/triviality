import { FF } from '../../../src';
import { ConsoleCommand } from '../ConsoleCommand';
import { ByeConsoleCommand } from './ByeConsoleCommand';
import { ConsoleFeatureServices } from '../ConsoleFeature';

interface ByeConsoleServices {
  byeConsoleCommand: ConsoleCommand;
}

export const ByeConsoleFeature: FF<ByeConsoleServices, ConsoleFeatureServices> = ({ registers: { consoleCommands }, construct, service }) => ({
  ...consoleCommands(service('byeConsoleCommand')),
  byeConsoleCommand: construct(ByeConsoleCommand),
});
