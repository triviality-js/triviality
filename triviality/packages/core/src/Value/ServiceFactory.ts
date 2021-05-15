import {PickByValue} from "utility-types";
import {functionName} from "../Util";

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

export function assertServiceFactory(sf: unknown, name: string): asserts sf is USF {
  if (typeof sf !== 'function') {
    throw new Error(`ServiceFactory ${name} should be a function`);
  }
  if (sf.length > 0) {
    throw new Error(`ServiceFactory '${name}' cannot have arguments (${functionName(sf as any)})`);
  }
}

export const isServiceFactory = (target: unknown): target is USF => {
  return typeof target === 'function' && target.length === 0;
};
