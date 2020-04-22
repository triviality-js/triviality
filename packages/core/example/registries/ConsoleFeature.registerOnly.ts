import { FF, RegistryList } from '../../src';
import { ConsoleCommand } from './ConsoleCommand';

export interface ConsoleFeatureServices {
  consoleCommands: RegistryList<ConsoleCommand>;
}

export const ConsoleFeature: FF<ConsoleFeatureServices> = ({ registerList }) => ({
  consoleCommands: registerList(),
});
