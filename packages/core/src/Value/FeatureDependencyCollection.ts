import { FeatureDependency } from './FeatureDependency';
import { Registry } from '../Type/Registry';

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

  public async getFeatureRegistries(): Promise<{ [name: string]: Registry[] }> {
    const combined: { [name: string]: Registry[] } = {};
    for (const feature of this.withRegistries().toArray()) {
      const registries = await feature.getRegistries();
      for (const name of Object.getOwnPropertyNames(registries)) {
        if (!combined[name]) {
          combined[name] = [];
        }
        combined[name].push(registries[name]);
      }
    }
    return combined;
  }

}
