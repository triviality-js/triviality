import { FF } from '@triviality/core';
import { PackageVersionReader } from './PackageVersionReader';
import { CommanderPackageVersionConfiguration } from './CommanderPackageVersionConfiguration';
import { CommanderFeatureServices } from '../CommanderFeature';

interface CommanderPackageVersionFeatureServices {
  commanderPackageVersionConfiguration: CommanderPackageVersionConfiguration;
  packageVersionReader: PackageVersionReader;
}

export const CommanderPackageVersionFeature: FF<CommanderPackageVersionFeatureServices, CommanderFeatureServices> = ({ construct }) => ({
  commanderPackageVersionConfiguration: construct(CommanderPackageVersionConfiguration, 'packageVersionReader'),
  packageVersionReader: construct(PackageVersionReader),
});
