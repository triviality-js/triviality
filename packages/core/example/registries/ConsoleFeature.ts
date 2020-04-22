import { ConsoleService } from './ConsoleService';
import { FF, RegistryList } from '../../src';
import { ConsoleCommand } from './ConsoleCommand';

export interface ConsoleFeatureServices {
  consoleCommands: RegistryList<ConsoleCommand>;
  consoleService: ConsoleService;
}

export const ConsoleFeature: FF<ConsoleFeatureServices> = ({ registerList }) => {
  const consoleCommands = registerList<ConsoleCommand>();
  return ({
    consoleCommands,
    consoleService: () => new ConsoleService(consoleCommands().toArray()),
  });
};
