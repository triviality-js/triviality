import { FeatureFactory, RegistryService } from '../../src';
import { ConsoleCommand } from '../registries/ConsoleCommand';
import { ConsoleService } from '../registries/ConsoleService';

export interface ConsoleFeatureServices {
  consoleService: () => ConsoleService;
  consoleCommand: RegistryService<() => ConsoleCommand[]>;
}

export const ConsoleFeature: FeatureFactory<ConsoleFeatureServices> = ({ createRegister, construct }) =>
  ({
    consoleCommand: createRegister(() => []),
    consoleService: construct('consoleCommand', ConsoleService),
  });
