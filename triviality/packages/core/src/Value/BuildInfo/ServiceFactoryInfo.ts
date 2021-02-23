import type {OverrideInformation} from '../index';
import type {ServiceFactoryReference} from "../ServiceFactoryReference";

export class ServiceFactoryInfo<T = unknown> {
  protected  overrides: OverrideInformation<T>[] = [];
  protected dependencies = new Set<ServiceFactoryInfo>();

  constructor(public readonly serviceFactoryFunction: ServiceFactoryReference<T>) {
  }

  public addOverride(override: OverrideInformation<T>) {
    this.overrides.push(override as OverrideInformation<T>);
  }

  public getOverrides() {
    return this.overrides;
  }

  public addDependency(dependency: ServiceFactoryInfo) {
    this.dependencies.add(dependency)
  }
  public getDependencies() {
    return Array.from(this.dependencies);
  }
}
