import { ContainerError } from '../ContainerError';
import { getAllPropertyValues } from '../util/getAllPropertyNames';
import { ModuleDependency } from './ModuleTypes';
import { OverrideableReferenceContainer } from './OverrideableReferenceContainer';
import { Service, ServiceName } from './Service';
import { memorize } from '../util/memorize';

export class BuildableContainer<C> {
  /**
   * Services map for unlocking and freezing the services.
   */
  private services: { [key: string]: Service } = {};

  constructor(private container: C) {
    this.defineLockedService('container', container as any);
  }

  public defineLockedModuleService(dependency: ModuleDependency<any, any>, name: ServiceName, service: Service) {
    if (typeof service === 'function') {
      this.defineLockedService(name, memorize(service.bind(this.container)));
      dependency.defineProperty(this, name);
    } else {
      this.defineLockedService(name, service);
    }
  }

  public defineLockedService(name: ServiceName, service: Service) {
    if (this.hasProperty(name)) {
      throw ContainerError.propertyOrServiceAlreadyDefined(name);
    }
    this.services[name] = service;
    Object.defineProperty(this.container, name, {
      get: ContainerError.throwIsLockedDuringBuild,
      set: ContainerError.throwIsLocked,
      configurable: true,
    });
  }

  public overrideService(name: ServiceName, value: Service) {
    if (!this.services[name]) {
      throw ContainerError.cannotAddExtraService(name);
    }
    this.services[name] = value;
  }

  public getOverrideableReferenceContainer(): OverrideableReferenceContainer<C> {
    return OverrideableReferenceContainer.fromBuildableContainer<C>(this);
  }

  public hasProperty(name: ServiceName): boolean {
    return !!this.services[name] || (this.container as any)[name];
  }

  public getReference(): C {
    return this.container;
  }

  public freezeContainer() {
    for (const [name, service] of getAllPropertyValues(this.services)) {
      this.freezeService(name, service);
    }
  }

  public freezeService(serviceName: ServiceName, value: Service) {
    Object.defineProperty(this.container, serviceName, {
      get: () => value,
      set: ContainerError.throwIsLocked,
      configurable: false,
    });
    delete this.services[serviceName];
  }

  public getService(name: ServiceName) {
    return this.services[name];
  }
}
