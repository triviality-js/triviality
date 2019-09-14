import { FF } from '../../../src';
import { RegistryList } from '../../../src/FeatureFactoryContext/FeatureFactoryRegistryContext/registerList';
import { ConsoleCommand } from '../ConsoleCommand';
import { ByeConsoleCommand } from './ByeConsoleCommand';

interface ByeConsoleServices {
  byeConsoleCommand: () => ConsoleCommand;
  consoleCommand: RegistryList<ConsoleCommand[]>;
}

export const ByeConsoleFeature: FF<ByeConsoleServices> = ({ registerList, construct, services }) => ({
  consoleCommand: registerList(services, 'byeConsoleCommand'),

  byeConsoleCommand: construct(ByeConsoleCommand),
});
