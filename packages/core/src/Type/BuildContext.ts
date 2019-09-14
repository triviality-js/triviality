import { OVERRIDE_SYMBOL, OverrideService, ServiceContainer, ServiceTag, SF } from '../types';

export interface BuildContext {
  container: ServiceContainer<any>;
  locked: boolean;
  services: Map<ServiceTag, SF>;
}

export const override = <S extends SF>(factory: (parent: S) => S): OverrideService<S> => {
  (factory as any)[OVERRIDE_SYMBOL] = true;
  return factory as any;
};

/**
 * Only used between Buildable feature and maybe for debuggable purposes.
 */
export function createBuildContext(): BuildContext {
  const container: any = {};
  container.registries = () => container;
  container.self = () => container;
  container.inject = (...args: any[]) =>
    () => {
      const tags: ServiceTag[] = args.slice(0, -1);
      const service: (...args: any[]) => unknown = args.slice(-1)[0];
      return service(...tags.map((tag) => container[tag]()));
    };
  container.construct = (...args: any[]) => {
    return (() => {
      const tags: ServiceTag[] = args.slice(0, -1);
      const service: new (...args: any[]) => unknown = args.slice(-1)[0];
      return new service(...tags.map((tag) => container[tag]()));
    });
  };
  container.override = override;
  return {
    container,
    services: new Map<ServiceTag, SF>(),
    locked: true,
  };
}
