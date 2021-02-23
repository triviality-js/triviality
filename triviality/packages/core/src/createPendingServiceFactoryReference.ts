/**
 * Context for creating new service factories.
 */
import {ServiceFactoryReference, ServiceFactoryInfo} from "./Value";
import {createNamedFunction} from "./Util";
import {ContainerError} from "./Error";

export interface PendingServiceFactoryReference<T> extends ServiceFactoryReference<T> {
  resolve(sfr: ServiceFactoryReference<T>): void;
  serviceName: string;
}

export const createPendingServiceFactoryReference = <T>(name: string): PendingServiceFactoryReference<T> => {
  let pending: ServiceFactoryReference<T> | null = null;
  const assertReference = (): ServiceFactoryReference<T> => {
    if (pending === null) {
      throw new ContainerError(`Cannot invoke pending service reference "${name}" `);
    }
    return pending;
  };
  const sfr = createNamedFunction(name, () => assertReference()()) as PendingServiceFactoryReference<T>;
  sfr.serviceName = name;
  sfr.resolve = (resolved: ServiceFactoryReference<T>) => {
    if (pending !== null) {
      throw new ContainerError('PendingServiceFactoryReference already resolved');
    }
    pending = resolved;
    sfr.info.getDependencies().forEach((d) => resolved.info.addDependency(d));
    sfr.info.getOverrides().forEach((d) => resolved.info.addOverride(d));
    sfr.info = resolved.info;
  };
  sfr.info =  new ServiceFactoryInfo(sfr);
  return sfr;
};
