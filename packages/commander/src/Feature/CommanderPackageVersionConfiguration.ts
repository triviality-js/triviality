import { CommanderConfigurationInterface } from '../CommanderConfigurationInterface';
import { Command } from 'commander';
import { PackageVersionReader } from './PackageVersionReader';

export class CommanderPackageVersionConfiguration implements CommanderConfigurationInterface {

  constructor(private versionReader: PackageVersionReader) {

  }

  public async configure(program: Command) {
    program.version(await this.versionReader.readVersion());
  }
}
