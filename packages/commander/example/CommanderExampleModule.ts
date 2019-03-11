import { Module } from '@triviality/core';
import { CommanderConfigurationInterface } from '../src';
import { CommanderHelloConfiguration } from './CommanderHelloConfiguration';
import { CommanderByeConfiguration } from './CommanderByeConfiguration';

export class CommanderExampleModule implements Module {
  public registries() {
    return {
      commanderConfigurations: (): CommanderConfigurationInterface[] => {
        return [
          this.commanderExampleConfiguration(),
          this.commanderByeExample(),
        ];
      },
    };
  }

  public commanderExampleConfiguration() {
    return new CommanderHelloConfiguration();
  }

  public commanderByeExample() {
    return new CommanderByeConfiguration();
  }
}
