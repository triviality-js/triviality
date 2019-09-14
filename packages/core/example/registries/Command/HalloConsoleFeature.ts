import { FF, SF } from '../../../src';
import { ConsoleCommand } from '../ConsoleCommand';
import { ConsoleFeatureServices } from '../ConsoleFeature';
import { HalloConsoleCommand } from './HalloConsoleCommand';

interface HalloConsoleServices {
  halloConsoleCommand: SF<ConsoleCommand>;
}

export const HalloConsoleFeature: FF<HalloConsoleServices, ConsoleFeatureServices> = ({ registerList, construct, self }) => ({
  consoleCommand: registerList(() => [self().halloConsoleCommand()]),
  halloConsoleCommand: construct(HalloConsoleCommand),
});
