import { Module } from '../Module';
import { getAllPropertyNames } from '../util/getAllPropertyNames';
import { Service, ServiceName } from './Service';
import { BuildableContainer } from './BuildableContainer';
import { RegistriesMap } from './Registry';
import { ModuleExcludes } from './ModuleTypes';

export class ModuleDependency {
  public constructor(private readonly module: Module<any, any>) {

  }

  public getServices(): Array<[ServiceName, Service]> {
    const services: Array<[ServiceName, Service]> = [];
    for (const name of getAllPropertyNames(this.module)) {
      if (ModuleExcludes.indexOf(name) >= 0) {
        continue;
      }
      const value = (this.module as any)[name];
      services.push([name, value]);
    }
    return services;
  }

  public hasServiceOverridesFunction(): boolean {
    return !!this.module.serviceOverrides;
  }

  public hasSetupFunction(): boolean {
    return !!this.module.setup;
  }

  public hasRegistriesFunction(): boolean {
    return !!this.module.registries;
  }

  public getRegistries(): RegistriesMap {
    if (!this.module.registries) {
      return {};
    }
    return this.module.registries();
  }

  public getServiceOverrideFunction<C>(): (container: C) => C | Promise<C> {
    const alterContainer = this.module.serviceOverrides;
    return (alterContainer as any).bind(this.module);
  }

  public getSetupFunction(): () => Promise<void> | void {
    const setup = this.module.setup;
    return (setup as any).bind(this.module);
  }

  public defineProperty<C>(container: BuildableContainer<C>, name: keyof C): any {
    const reference = container.getReference();
    Object.defineProperty(this.module, name, {
      get: () => reference[name],
      set: (value: any) => {
        return reference[name] = value;
      },
    });
  }

}
