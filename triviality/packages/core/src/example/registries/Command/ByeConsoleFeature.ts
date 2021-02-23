import { FF } from '@triviality/core';
import { ConsoleCommand } from '../ConsoleCommand';
import { ByeConsoleCommand } from './ByeConsoleCommand';
import { ConsoleFeatureServices } from '../ConsoleFeature';

interface ByeConsoleServices {
  byeConsoleCommand: ConsoleCommand;
}

export const ByeConsoleFeature: FF<ByeConsoleServices, ConsoleFeatureServices> = ({ register, construct }) => ({
  ...register('consoleCommands', 'byeConsoleCommand'),
  byeConsoleCommand: construct(ByeConsoleCommand),
});
