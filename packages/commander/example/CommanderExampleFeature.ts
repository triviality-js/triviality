import { FF } from '@triviality/core';
import { CommanderFeatureServices } from '../src';
import { CommanderHelloConfiguration } from './CommanderHelloConfiguration';
import { CommanderByeConfiguration } from './CommanderByeConfiguration';

export const CommanderExampleFeature: FF<{}, CommanderFeatureServices> = ({ registers: { commanderConfigurations } }) => ({
  ...commanderConfigurations(() => new CommanderHelloConfiguration()),
  ...commanderConfigurations(() => new CommanderByeConfiguration()),
});
