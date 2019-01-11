import { FeatureDependency } from './FeatureDependency';
import { mergeRegistries, mergeRegistryValues, Registry } from './Registry';
import { getAllPropertyNames } from '../util/getAllPropertyNames';
import { ContainerError } from '../ContainerError';
import { memorize } from '../util/memorize';

export class FeatureDependencyCollection {

  public constructor(private readonly feature: FeatureDependency[] = []) {

  }

  public add(feature: FeatureDependency) {
    this.feature.push(feature);
  }

  public toArray() {
    return this.feature;
  }

  public withServiceOverridesFunctions(): FeatureDependencyCollection {
    return this.filter((feature) => feature.hasServiceOverridesFunction());
  }

  public withSetupsFunctions(): FeatureDependencyCollection {
    return this.filter((feature) => feature.hasSetupFunction());
  }

  public withRegistries(): FeatureDependencyCollection {
    return this.filter((feature) => feature.hasRegistriesFunction());
  }

  public filter(filter: (feature: FeatureDependency) => boolean): FeatureDependencyCollection {
    return new FeatureDependencyCollection(this.feature.filter(filter));
  }

  public async getRegistries(): Promise<{ [name: string]: Registry }> {
    const combined: { [name: string]: Registry[] } = await this.getFeatureRegistries();
    const registries: { [name: string]: Registry } = {};
    getAllPropertyNames(combined).forEach((register) => {
      const registerCached = memorize(() => mergeRegistryValues(combined[register].map((reg) => reg())));
      Object.defineProperty(registries, register, { get: () => registerCached, set: ContainerError.throwIsLocked });
    });
    return registries;
  }

  private async getFeatureRegistries(): Promise<{ [name: string]: Registry[] }> {
    let combined: { [name: string]: Registry[] } = {};
    for (const feature of this.withRegistries().toArray()) {
      combined = mergeRegistries(combined, await feature.getRegistries());
    }
    return combined;
  }

}
