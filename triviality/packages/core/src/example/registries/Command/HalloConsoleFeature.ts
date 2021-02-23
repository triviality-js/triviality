import { FF } from '@triviality/core';
import { ConsoleFeatureServices } from '../ConsoleFeature';
import { HalloConsoleCommand } from './HalloConsoleCommand';

export const HalloConsoleFeature: FF<unknown, ConsoleFeatureServices> = ({ register, construct }) => ({
  ...register('consoleCommands', construct(HalloConsoleCommand)),
});
