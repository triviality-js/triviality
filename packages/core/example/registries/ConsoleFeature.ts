import { ConsoleService } from './ConsoleService';
import { FF, RegistryList, SF } from '../../src';
import { ConsoleCommand } from './ConsoleCommand';

export interface ConsoleFeatureServices {
  consoleCommands: SF<RegistryList<ConsoleCommand>>;
  consoleService: SF<ConsoleService>;
}

export const ConsoleFeature: FF<ConsoleFeatureServices> = ({ registerList }) => {
  const consoleCommands = registerList<ConsoleCommand>();
  return ({
    consoleCommands,
    consoleService: () => new ConsoleService(consoleCommands().toArray()),
  });
};
