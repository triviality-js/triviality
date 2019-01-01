import { ModuleDependency } from './ModuleDependency';
import { mergeRegistries, mergeRegistryValues, Registry } from './Registry';
import { getAllPropertyNames } from '../util/getAllPropertyNames';
import { ContainerError } from '../ContainerError';
import { memorize } from '../util/memorize';

export class ModuleDependencyCollection {

  public constructor(private readonly modules: ModuleDependency[] = []) {

  }

  public add(module: ModuleDependency) {
    this.modules.push(module);
  }

  public toArray() {
    return this.modules;
  }

  public withServiceOverridesFunctions(): ModuleDependencyCollection {
    return this.filter((module) => module.hasServiceOverridesFunction());
  }

  public withSetupsFunctions(): ModuleDependencyCollection {
    return this.filter((module) => module.hasSetupFunction());
  }

  public withRegistries(): ModuleDependencyCollection {
    return this.filter((module) => module.hasRegistriesFunction());
  }

  public filter(filter: (module: ModuleDependency) => boolean): ModuleDependencyCollection {
    return new ModuleDependencyCollection(this.modules.filter(filter));
  }

  public async getRegistries(): Promise<{ [name: string]: Registry }> {
    const combined: { [name: string]: Registry[] } = await this.getModuleRegistries();
    const registries: { [name: string]: Registry } = {};
    getAllPropertyNames(combined).forEach((register) => {
      const registerCached = memorize(() => mergeRegistryValues(combined[register].map((reg) => reg())));
      Object.defineProperty(registries, register, { get: () => registerCached, set: ContainerError.throwIsLocked });
    });
    return registries;
  }

  private async getModuleRegistries(): Promise<{ [name: string]: Registry[] }> {
    let combined: { [name: string]: Registry[] } = {};
    for (const module of this.withRegistries().toArray()) {
      combined = mergeRegistries(combined, await module.getRegistries());
    }
    return combined;
  }

}
