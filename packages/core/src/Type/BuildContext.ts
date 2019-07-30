import { RegistriesMap, Service, ServiceContainer, ServiceMap, ServiceName } from '../types';

export interface BuildContext {
  container: ServiceContainer<unknown>;
  locked: boolean;
  services: ServiceMap;
  registriesFunction: RegistriesMap;
}

/**
 * Only used between Buildable feature and maybe for debuggable purposes.
 */
export function createBuildContext(): BuildContext {
  const container: any = {};
  container.registries = () => container;
  return {
    container,
    registriesFunction: new Map<ServiceName, Service[]>(),
    services: new Map<ServiceName, Service>(),
    locked: true,
  };
}
