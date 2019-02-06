import { ContainerError } from '../Error/ContainerError';
import { BuildableContainer } from '../Buildable/BuildableContainer';
import { getAllPropertyNames } from '../util/getAllPropertyNames';
import { Service, ServiceName } from '../Type/Service';

export class OverrideableReferenceContainer<S, R> {
  public static fromBuildableContainer<S, R>(container: BuildableContainer<S, R>) {
    const references: any = {};
    for (const name of getAllPropertyNames(container.getReference() as any)) {
      Object.defineProperty(references, name, {
        get: ContainerError.throwIsLockedDuringBuild,
        set: ContainerError.throwIsLocked,
        configurable: true,
      });
    }
    return new this<S, R>(container, references);
  }

  /**
   * Contains the references to the original services.
   */
  private overridden: { [name: string]: Service } = {};

  constructor(private buildableContainer: BuildableContainer<S, R>, private reference: S) {
  }

  public overrideService(name: ServiceName, service: Service) {
    if (!this.buildableContainer.hasProperty(name)) {
      throw ContainerError.cannotAddExtraService(name);
    }
    this.overridden[name] = this.buildableContainer.getService(name);
    this.buildableContainer.overrideService(name, service);
  }

  public getReference(): S {
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
