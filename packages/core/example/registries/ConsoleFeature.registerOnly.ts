import { FF, RegistryList } from '../../src';
import { SF } from '../../src';
import { ConsoleCommand } from './ConsoleCommand';

export interface ConsoleFeatureServices {
  consoleCommands: SF<RegistryList<ConsoleCommand>>;
}

export const ConsoleFeature: FF<ConsoleFeatureServices> = ({ registerList }) => ({
  consoleCommands: registerList(),
});
