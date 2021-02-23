import { FF } from '@triviality/core';
import { ConsoleCommand } from './ConsoleCommand';

export interface ConsoleFeatureServices {
  consoleCommands: Array<ConsoleCommand>;
}

export const ConsoleFeature: FF<ConsoleFeatureServices> = () => ({
  consoleCommands: () => [],
});
