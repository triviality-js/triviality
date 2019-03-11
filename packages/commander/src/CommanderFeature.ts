import { Container, Feature } from '@triviality/core';
import { LoggerFeature } from '@triviality/logger';
import { Command } from 'commander';
import { CommanderConfigurationInterface } from './CommanderConfigurationInterface';
import { StartCommanderService } from './StartCommanderService';

export class CommanderFeature implements Feature {

  constructor(private container: Readonly<Container<LoggerFeature>>) {

  }

  public registries() {
    return {
      commanderConfigurations: (): CommanderConfigurationInterface[] => {
        return [];
      },
    };
  }

  public async setup() {
    const pending: Array<Promise<void>> = [];
    this.registries()
      .commanderConfigurations()
      .forEach((service) => {
        pending.push(Promise.resolve(service.configure(this.commanderService())));
      });
    await Promise.all(pending);
  }

  public commanderService(): Command {
    return new Command();
  }

  public startCommanderService() {
    return new StartCommanderService(this.commanderService(), this.container.logger());
  }
}
