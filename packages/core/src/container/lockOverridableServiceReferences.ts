import { curryN } from 'ramda';
import { ContainerError } from '..';
import { BuildContext } from '../Type/BuildContext';

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
