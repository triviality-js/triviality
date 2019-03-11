import { Feature } from '@triviality/core';
import { CommanderConfigurationInterface } from '../CommanderConfigurationInterface';
import { PackageVersionReader } from './PackageVersionReader';
import { CommanderPackageVersionConfiguration } from './CommanderPackageVersionConfiguration';

export class CommanderPackageVersionFeature implements Feature {
  public registries() {
    return {
      commanderConfigurations: (): CommanderConfigurationInterface[] => {
        return [this.commanderPackageVersionConfiguration()];
      },
    };
  }

  public commanderPackageVersionConfiguration() {
    return new CommanderPackageVersionConfiguration(this.packageVersionReader());
  }

  public packageVersionReader(): PackageVersionReader {
    return new PackageVersionReader();
  }
}
