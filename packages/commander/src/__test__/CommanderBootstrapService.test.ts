import triviality from '@triviality/core';
import { DefaultLoggerFeature } from '@triviality/logger';
import { CommanderFeature } from '../CommanderFeature';
import { CommanderPackageVersionFeature } from '../Feature';

it('Can run commander', async () => {

  const serviceContainer = await triviality()
    .add(DefaultLoggerFeature)
    .add(CommanderFeature)
    .add(CommanderPackageVersionFeature)
    .build();

  expect(serviceContainer).not.toBeNull();
});
