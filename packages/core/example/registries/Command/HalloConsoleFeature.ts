import { FF } from '../../../src';
import { ConsoleFeatureServices } from '../ConsoleFeature';
import { HalloConsoleCommand } from './HalloConsoleCommand';

export const HalloConsoleFeature: FF<{}, ConsoleFeatureServices> = ({ registers: { consoleCommands }, construct }) => ({
  ...consoleCommands(construct(HalloConsoleCommand)),
});
