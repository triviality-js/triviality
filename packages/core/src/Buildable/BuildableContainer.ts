import { ContainerError } from '../Error/ContainerError';
import { getAllPropertyValues } from '../util/getAllPropertyNames';
import { Service, ServiceName } from '../Type/Service';
import { memorize } from '../util/memorize';
import { FeatureDependency } from '../Value/FeatureDependency';
import { HasRegistries, RegistriesMap } from '../Type/Registry';
import { OverrideableReferenceContainer } from '../Value/OverrideableReferenceContainer';

export class BuildableContainer<S, R> {
  /**
   * Services map for unlocking and freezing the services.
   */
  private services: { [key: string]: Service } = {} as any;
  private container: { [key: string]: Service } & HasRegistries<R> = {} as any;

  constructor() {
    Object.defineProperty(this.container, 'registries', {
      get: ContainerError.throwIsLockedDuringBuild,
      set: ContainerError.throwIsLocked,
      configurable: true,
    });
    this.defineLockedService('container', this.container);
  }

  public defineLockedFeatureService(dependency: FeatureDependency, name: ServiceName, service: Service) {
    if (typeof service === 'function') {
      this.defineLockedService(name, memorize(service.bind(this.container)));
      dependency.defineProperty<S, R>(this, name as any);
    } else {
      this.defineLockedService(name, service);
    }
  }

  public defineLockedService(name: ServiceName, service: Service) {
    if (this.hasProperty(name)) {
      throw ContainerError.propertyOrServiceAlreadyDefined(name as string);
    }
    this.services[name] = service;
    Object.defineProperty(this.container, name, {
      get: ContainerError.throwIsLockedDuringBuild,
      set: ContainerError.throwIsLocked,
      configurable: true,
    });
  }

  public defineRegistries(registries: () => RegistriesMap) {
    Object.defineProperty(this.container, 'registries', {
      get: () => registries,
      set: ContainerError.throwIsLocked,
      configurable: false,
    });
  }

  public overrideService(name: string, service: Service) {
    if (!this.services[name]) {
      throw ContainerError.cannotAddExtraService(name as string);
    }
    if (typeof service === 'function') {
      this.services[name] = memorize(service);
    } else {
      this.services[name] = service;
    }
  }

  public hasProperty(name: ServiceName): boolean {
    return !!this.services[name] || this.container[name];
  }

  public getReference(): S & HasRegistries<R> {
    return this.container as any;
  }

  public getOverrideableReferenceContainer(): OverrideableReferenceContainer<S, R> {
    return OverrideableReferenceContainer.fromBuildableContainer<S, R>(this);
  }

  /**
   * Freeze any registered service on the container. The services cannot be altered anymore, and can be fetched.
   */
  public freezeContainer() {
    for (const [name, service] of getAllPropertyValues(this.services)) {
      this.freezeService(name, service);
    }
  }

  public freezeService(name: ServiceName, value: Service) {
    Object.defineProperty(this.container, name, {
      get: () => value,
      set: ContainerError.throwIsLocked,
      configurable: false,
    });
    delete this.services[name];
  }

  public getService(name: ServiceName) {
    return this.services[name];
  }
}
