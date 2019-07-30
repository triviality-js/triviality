export const REGISTER_SYMBOL = Symbol.for('TRIVIALITY_REGISTER');

export type RegisterServices<T> = {
  [K in keyof T]: T[K] extends RegistryService ? T[K] : never;
};

export type Service = ((...args: any[]) => any);

export interface RegistryService {
  [REGISTER_SYMBOL]: true;
}

export type ServiceMap = Map<ServiceName, Service>;

export type ServiceName = string;

export type FeatureInstance<Services = {}> = Services;

export type FeatureFactory<ContainerServices = {}, OwnServices = {}> =
  (services: OverrideServiceContainer<ContainerServices, OwnServices>) => FeatureInstance<OwnServices>;

export type OverrideServiceContainer<ContainerServices, OwnServices> =  ContainerServices & { registries: () => RegisterServices<ContainerServices & OwnServices> };
export type ServiceContainer<S> = S & { registries: () => RegisterServices<S> } ;

export type RegistryValues = any[] | { [key: string]: any };
export type Registry = () => RegistryValues;

export type RegistriesMap = Map<ServiceName, Service[]>;

/**
 * Preserves service references to all services overrides.
 */
export interface ReferenceBuildContainer {
  overrides: ServiceMap;
}
