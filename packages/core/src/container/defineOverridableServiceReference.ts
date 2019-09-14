import { curryN, once } from 'ramda';
import { ContainerError } from '..';
import { BuildContext } from '../Type/BuildContext';
import { ServiceTag, SF } from '../types';

/**
 * This add's a service reference to the container. You can get reference function to the service,
 * but not yet fetch the service.
 */
export const defineOverridableServiceReference = curryN(2, (context: BuildContext, name: ServiceTag, service: SF): void => {
  const { services, container } = context;
  services.set(name, once(service.bind(container)));
  Object.defineProperty(container, name, {
    get: () => {
      return () => {
        if (context.locked) {
          throw ContainerError.containerIsLockedDuringBuild();
        }
        return services.get(name)!.apply(container);
      };
    },
    set: ContainerError.throwIsLocked,
    configurable: true,
  });
});
