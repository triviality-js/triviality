import { ContainerError } from '../ContainerError';
import { BuildableContainer } from './BuildableContainer';
import { getAllPropertyNames } from '../util/getAllPropertyNames';
import { Service, ServiceName } from './Service';

export class OverrideableReferenceContainer<C> {
  public static fromBuildableContainer<C>(container: BuildableContainer<C>) {
    const references: any = {};
    for (const name of getAllPropertyNames(container.getReference() as any)) {
      Object.defineProperty(references, name, {
        get: ContainerError.throwIsLockedDuringBuild,
        set: ContainerError.throwIsLocked,
        configurable: true,
      });
    }
    return new this<C>(container, references);
  }

  /**
   * Contains the references to the orginal services.
   */
  private overridden: { [name: string]: Service } = {};

  constructor(private buildableContainer: BuildableContainer<C>, private reference: C) {
  }

  public overrideService(name: ServiceName, service: Service) {
    if (!this.buildableContainer.hasProperty(name)) {
      throw ContainerError.cannotAddExtraService(name);
    }
    this.overridden[name] = this.buildableContainer.getService(name);
    this.buildableContainer.overrideService(name, service);
  }

  public getReference(): C {
    return this.reference;
  }

  public freezeContainer() {
    for (const name of getAllPropertyNames(this.reference as any)) {
      this.freezeService(name);
    }
  }

  private freezeService(name: ServiceName) {
    const reference: any = this.buildableContainer.getReference();
    Object.defineProperty(this.reference, name, {
      get: this.overridden[name] ? () => this.overridden[name] : () => reference[name],
      set: ContainerError.throwIsLocked,
      configurable: false,
    });
  }

}
