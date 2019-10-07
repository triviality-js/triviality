
export interface RegistryPending extends Iterable<any> {
  (): any;

  register: (...args: any[]) => any;
}

/**
 * Only calls the SF when services are fetched or the iterator is called.
 */
export function registerPending<T extends RegistryPending, A extends any[]>(createRegistry: (...args: A) => T, ...factoryArgs: A): T {
  let registry: T | undefined;
  const pendingRegistrations: A[] = [];
  const callRegistry = () => {
    if (registry) {
      return registry;
    }
    registry = createRegistry(...factoryArgs);
    pendingRegistrations
      .splice(0)
      .forEach((pending) => registry!.register(...pending));
    instance.register = registry.register.bind(registry!);
    instance[Symbol.iterator] = registry[Symbol.iterator].bind(registry!);
    return registry;
  };
  const instance: RegistryPending = (() => callRegistry()()) as any;
  instance[Symbol.iterator] = () => callRegistry()[Symbol.iterator]();
  instance.register = (...args: A) => {
    if (registry) {
      return registry.register(...args);
    }
    pendingRegistrations.push(args);
    return instance;
  };
  return instance as any;
}
