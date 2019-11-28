import { FF, SetupFeatureServices } from '@triviality/core';
import { Command } from 'commander';
import { CommanderConfigurationInterface } from './CommanderConfigurationInterface';
import { CommanderBootstrapService } from './CommanderBootstrapService';
import { LoggerFeatureServices } from '@triviality/logger';
import { RegistryList } from '@triviality/core/src';

export interface CommanderFeatureServices {
  commanderBootstrapService: CommanderBootstrapService;
  commanderConfigurations: RegistryList<CommanderConfigurationInterface>;
  commanderService: Command;
}

export const CommanderFeature: FF<CommanderFeatureServices, LoggerFeatureServices & SetupFeatureServices> =
  ({ registerList, construct }) => ({
    commanderConfigurations: registerList(),
    commanderService: construct(Command),
    commanderBootstrapService: construct(CommanderBootstrapService, 'commanderService', 'commanderConfigurations', 'logger'),
  });
