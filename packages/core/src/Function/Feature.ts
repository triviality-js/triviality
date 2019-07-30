import { curryN, toPairs } from 'ramda';
import { ContainerError, ServiceContainer } from '../index';
import { FeatureInstance } from '../Type/Feature';
import { Service, ServiceName } from '../Type/Service';

/**
 * Return all services of feature instance as a name, pair.
 */
export const getServices = (feature: FeatureInstance): Array<[ServiceName, Service]> => {
  return toPairs<Service>(feature.services as { [key: string]: Service });
};

/**
 * Define reference if instance to the service container.
 *
 * All services are references, and passed to the ServiceContainer to be able to override the service.
 */
export const defineFeatureProperty = curryN(2, <S, R>(reference: ServiceContainer<S, R>, feature: FeatureInstance<S, R>, name: keyof typeof reference) => {
  Object.defineProperty(feature.services, name, {
    get: () => reference[name],
    set: () => {
      throw ContainerError.cannotDynamicallyOverrideExtraService(name as string);
    },
    configurable: false,
  });
});
