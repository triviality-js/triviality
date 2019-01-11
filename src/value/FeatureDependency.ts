import { Feature } from '../Feature';
import { getAllPropertyNames } from '../util/getAllPropertyNames';
import { Service, ServiceName } from './Service';
import { BuildableContainer } from './BuildableContainer';
import { RegistriesMap } from './Registry';
import { FeatureExcludes } from './FeatureTypes';

export class FeatureDependency {
  public constructor(private readonly feature: Feature<any, any>) {

  }

  public getServices(): Array<[ServiceName, Service]> {
    const services: Array<[ServiceName, Service]> = [];
    for (const name of getAllPropertyNames(this.feature)) {
      if (FeatureExcludes.indexOf(name) >= 0) {
        continue;
      }
      const value = (this.feature as any)[name];
      services.push([name, value]);
    }
    return services;
  }

  public hasServiceOverridesFunction(): boolean {
    return !!this.feature.serviceOverrides;
  }

  public hasSetupFunction(): boolean {
    return !!this.feature.setup;
  }

  public hasRegistriesFunction(): boolean {
    return !!this.feature.registries;
  }

  public async getRegistries(): Promise<RegistriesMap> {
    if (!this.feature.registries) {
      return {};
    }
    return this.feature.registries();
  }

  public getServiceOverrideFunction<C>(): (container: C) => C | Promise<C> {
    const alterContainer = this.feature.serviceOverrides;
    return (alterContainer as any).bind(this.feature);
  }

  public getSetupFunction(): () => Promise<void> | void {
    const setup = this.feature.setup;
    return (setup as any).bind(this.feature);
  }

  public defineProperty<C>(container: BuildableContainer<C>, name: keyof C): any {
    const reference = container.getReference();
    Object.defineProperty(this.feature, name, {
      get: () => reference[name],
      set: (value: any) => {
        return reference[name] = value;
      },
    });
  }

}
