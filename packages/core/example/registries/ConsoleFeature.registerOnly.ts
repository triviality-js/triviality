import { FF, RSF } from '../../src';
import { ConsoleCommand } from '../registries/ConsoleCommand';

export interface ConsoleFeatureServices {
  consoleCommand: RSF<ConsoleCommand[]>;
}

export const ConsoleFeature: FF<ConsoleFeatureServices> = ({ createRegister }) => ({
  consoleCommand: createRegister(() => []),
});
