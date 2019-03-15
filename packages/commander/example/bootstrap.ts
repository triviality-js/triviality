import { ContainerFactory } from '@triviality/core';
import { DefaultLoggerFeature } from '@triviality/logger';
import { CommanderFeature } from '../src';
import { CommanderPackageVersionFeature } from '../src';
import { CommanderExampleModule } from './CommanderExampleModule';

ContainerFactory
  .create()
  .add(DefaultLoggerFeature)
  .add(CommanderFeature)
  .add(CommanderPackageVersionFeature)
  .add(CommanderExampleModule)
  .build()
  .then((container) => {
    container
      .startCommanderService()
      .start();
  });
