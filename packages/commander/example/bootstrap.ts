import { ContainerFactory } from '@triviality/core';
import { DefaultLoggerFeature } from '@triviality/logger';
import { CommanderFeature, CommanderPackageVersionFeature } from '../src';
import { CommanderExampleFeature } from './CommanderExampleFeature';

ContainerFactory
  .create()
  .add(DefaultLoggerFeature)
  .add(CommanderFeature)
  .add(CommanderPackageVersionFeature)
  .add(CommanderExampleFeature)
  .build()
  .then(({ commanderBootstrapService }) => commanderBootstrapService.handle());
