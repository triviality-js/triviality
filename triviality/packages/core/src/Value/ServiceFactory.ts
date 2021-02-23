import {PickByValue} from "utility-types";

export type ServiceFactory<T> = () => T;

/**
 * Short service factory
 */
export type SF<T> = ServiceFactory<T>;

/**
 * Unknown service factory
 */
export type USF = ServiceFactory<unknown>;

/**
 * Key or service factory
 */
export type KSF<T, V> = ServiceFactory<V> | keyof PickByValue<T, V>

export type ServicesAsFactories<Services> = {
  [K in keyof Services]: ServiceFactory<Services[K]>;
};

export const assetServiceFactory = (sf: unknown): sf is USF | never => {
  if (typeof sf !== 'function') {
    throw new Error('ServiceFactory should be a function');
  }
  if (sf.length > 0) {
    throw new Error(`ServiceFactory '${sf.name}' cannot have any arguments`);
  }
  return true;
};

export const isServiceFactory = (target: unknown): target is USF => {
  return typeof target === 'function' && target.length === 0;
};
