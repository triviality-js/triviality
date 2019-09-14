import { defineOverridableServiceReference } from './container/defineOverridableServiceReference';
import { lockOverridableServiceReferences } from './container/lockOverridableServiceReferences';
import { ContainerError } from './Error/ContainerError';
import { FeatureFactory } from './FeatureFactory';
import { ServiceContainer } from './ServiceContainer';
import { SF } from './ServiceFactory';
import { createBuildContext } from './Type/BuildContext';

/**
 * Container factory.
 */
export class ContainerFactory<S> {

  public constructor(private serviceFactories: Array<FeatureFactory<S>> = []) {
  }

  /**
   * Merge functional service factory.
   */
  public add<FS>(f1: FeatureFactory<FS, S>): ContainerFactory<S & FS> {
    return new ContainerFactory([...this.serviceFactories, f1] as any) as any;
  }

  public async build(): Promise<ServiceContainer<S>> {
    const context = createBuildContext();
    const container = context.container;
    const defineService: (name: string, service: SF) => void = defineOverridableServiceReference(context);
    this.serviceFactories.map((factory) => {
      const instance = factory(container);
      Object.entries(instance).forEach(([name, service]) => {
        if (isServiceOverride(service)) {
          if (!context.services.has(name)) {
            throw ContainerError.cannotOverrideNonExistingService(name);
          }
          defineService(name, service(context.services.get(name)!));
          return;
        }
        if (typeof service !== 'function') {
          throw ContainerError.isNotAServiceFunction(name);
        }
        if (context.services.has(name)) {
          throw ContainerError.serviceAlreadyDefined(name);
        }
        defineService(name, service);
      });
      return instance;
    });
    context.locked = false;
    for (const instance of container.setup()) {
      await instance.call(context.container);
    }
    lockOverridableServiceReferences(context.container);
    return container as any;
  }
}
