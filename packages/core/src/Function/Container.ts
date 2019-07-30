import { curryN } from 'ramda';
import { ContainerError } from '..';
import { BuildContext } from '../Type/BuildContext';
import { ReferenceBuildContainer, Service, ServiceName } from '../types';
import { memorize } from '../util/memorize';

/**
 * This add's a service reference to the container. You can get reference function to the service,
 * but not yet fetch the service.
 */
export const defineOverridableServiceReference = curryN(2, (context: BuildContext, name: ServiceName, service: Service) => {
  const { services, container } = context;
  services.set(name, memorize(service.bind(container)));
  Object.defineProperty(container, name, {
    get: () => {
      return (...args: any[]) => {
        if (context.locked) {
          throw ContainerError.containerIsLockedDuringBuild();
        }
        return services.get(name)!.apply(container, args);
      };
    },
    set: ContainerError.throwIsLocked,
    configurable: true,
  });
});

/**
 * This add's a service reference to the container. You can get reference function to the service,
 * but not yet fetch the service.
 */
export const defineOverridableServiceRegistryReference = curryN(2, (container: BuildContext, name: ServiceName, service: Service) => {
  if (!container.registriesFunction.has(name)) {
    container.registriesFunction.set(name, []);
  }
  container.registriesFunction.get(name)!.push(service);
  // Will throw when service is locked, so it does not generate inf loop.
  defineOverridableServiceReference(container, name, () => (container as any)[name]());
});

/**
 * Creates services references to all overrides specified on the ReferenceBuildContainer.
 */
export const shallowReferenceContainer = ({ container, services }: BuildContext): ReferenceBuildContainer => {
  const originalServices = new Map<ServiceName, Service>(services.entries());
  const shallowReferenceClone: ReferenceBuildContainer = {
    overrides: new Map<ServiceName, Service>(),
  };
  Object.getOwnPropertyNames(services).map((name) => {
    Object.defineProperty(container, name, {
      // This is only used when the services was not fetched when the container was being locked.
      get: shallowReferenceClone.overrides.hasOwnProperty(name) ? originalServices.get(name) : (container as any)[name],
      set: ContainerError.throwIsLocked,
      configurable: false,
    });
  });
  return shallowReferenceClone;
};

/**
 * The service cannot be set anymore.
 */
export const lockOverridableServiceReferences = curryN(2, ({ container, services }: BuildContext) => {
  for (const [name, service] of services.entries()) {
    const descriptor = Object.getOwnPropertyDescriptor(container, name)!;
    if (descriptor.configurable) {
      Object.defineProperty(container, name, {
        // This is only used when the services was not fetched when the container was being locked.
        get: service,
        set: ContainerError.throwIsLocked,
        configurable: false,
      });
    }
  }
});
