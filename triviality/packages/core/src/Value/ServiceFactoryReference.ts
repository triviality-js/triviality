import {SF, USF} from '../Value';
import {isObject} from "lodash";
import {ServiceFactoryInfo} from "./BuildInfo";

/**
 * The service glue of the triviality.
 */
export interface ServiceFactoryReference<S = unknown> extends SF<S> {
  info: ServiceFactoryInfo<S>;
}

export type SFR<S = unknown> = ServiceFactoryReference<S>;

export type ServiceFactoryReferences<Services = unknown> = {
  [K in keyof Services]: SFR<Services[K]>;
};

export function isServiceFactoryReference<S>(sf: () => S): sf is ServiceFactoryReference<S> {
  const target = sf as ServiceFactoryReference<S>;
  if (typeof target !== 'function') {
    return false;
  }
  if (target.length !== 0) {
    return false;
  }
  return isObject(target.info);
}

export interface GetServiceFactory<T> {
  <S>(sf: SF<S>): SFR<S>;
  <K extends keyof T>(name: K): SFR<T[K]>;
}

export const getServiceFactories = <T>(getService: GetServiceFactory<T>, tags: (keyof T | USF)[]) => tags.map((t: (keyof T | USF)) => getService(t as any));
export const getServiceInstances = (factories: USF[]) => factories.map((f) => f());
