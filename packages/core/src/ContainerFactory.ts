import { compose, nth, toPairs, chain, filter } from 'ramda';
import { ContainerError } from './Error/ContainerError';
import {
  defineOverridableServiceReference,
  defineOverridableServiceRegistryReference,
  lockOverridableServiceReferences,
} from './Function/Container';
import { isRegistryService, mergeRegistryValues } from './Function/Registries';
import { createBuildContext } from './Type/BuildContext';
import { FeatureFactory, REGISTER_SYMBOL, Registry, RegistryService, ServiceContainer } from './types';

export const register = <T extends Registry>(r: T): T & RegistryService => {
  (r as any)[REGISTER_SYMBOL] = true;
  return r as any;
};

/**
 * Container factory.
 */
export class ContainerFactory<S> {

  public constructor(private serviceFactories: Array<FeatureFactory<S>> = []) {
  }

  /**
   * Merge functional service factory.
   */
  public add<FS>(f1: FeatureFactory<S, FS>): ContainerFactory<S & FS> {
    return new ContainerFactory([...this.serviceFactories, f1] as any) as any;
  }

  public async build(): Promise<ServiceContainer<S>> {
    const context = createBuildContext();
    const container = context.container;
    const defineService = defineOverridableServiceReference(context);
    const defineRegistryReference = defineOverridableServiceRegistryReference(context);
    const defineRegistryReferences = chain(([k, v]) => defineRegistryReference(k, v));
    // const instances: Array<FeatureInstance<unknown, unknown>> =
    this.serviceFactories.map((factory) => {
      const instance = factory(container as any);
      if (instance) {
        Object.entries(instance).forEach(([name, service]) => {
          if (isRegistryService(service)) {
            return;
          }
          if (typeof service !== 'function') {
            throw ContainerError.serviceNotAFunction(name);
          }
          if (context.services.has(name)) {
            throw ContainerError.serviceAlreadyDefined(name);
          }
          defineService(name, service);
        });
      }
      const registries = filter(compose(isRegistryService, nth(1) as any), toPairs(instance));
      defineRegistryReferences(registries);

      // if (instance.serviceOverrides) {
      //   const referenceContainer = shallowReferenceContainer(context);
      //   referenceContainer.overrides = instance.serviceOverrides(referenceContainer as any) as any;
      //   Object.entries(referenceContainer.overrides).forEach(defineService);
      // }
      return instance;
    });
    context.locked = false;
    for (const [name, services] of context.registriesFunction.entries()) {
      defineService(name, () => {
        return mergeRegistryValues(services.map((service: any) => service()));
      });
    }
    // for (const instance of instances) {
    //   if (instance.setup) {
    //     await instance.setup();
    //   }
    // }
    lockOverridableServiceReferences(context.container);
    return container as any;
  }
}
