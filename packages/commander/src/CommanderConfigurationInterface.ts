import { Command } from 'commander';

export interface CommanderConfigurationInterface {

  configure(program: Command): void | Promise<void>;

}
