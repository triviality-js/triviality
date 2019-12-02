import { ServiceTag, SF } from '../ServiceFactory';
import { once, watchCallStack } from '../lib';

export interface ImmutableContainer {
  getService(k: ServiceTag): SF<unknown>;

  setService(k: ServiceTag, sf: SF<unknown>): this;

  services(): Array<[ServiceTag, SF]>;

  hasService(k: ServiceTag): boolean;
}

const getServiceFromContainer = (container: Map<string, SF>) => (k: string): SF => {
  const service = container.get(k);
  if (!service) {
    throw new Error(`Service '${k}' not found`);
  }
  return service;
};

const setServiceToContainer = (container: Map<string, SF>) => (k: string, sf: SF): ImmutableContainer => {
  if (typeof sf !== 'function' || sf.length > 0) {
    throw new Error(`ServiceFactory '${k}' cannot have any arguments`);
  }
  const copy = new Map<string, SF<unknown>>(container.entries());
  copy.set(k.toString(), watchCallStack('invoke', k)(once(sf)));
  return createImmutableContainer(copy);
};

export const createImmutableContainer = (container = new Map<string, SF>()): ImmutableContainer => {
  const copy = new Map<ServiceTag, SF>(container.entries());
  return {
    getService: getServiceFromContainer(copy),
    setService: setServiceToContainer(copy),
    hasService: copy.has.bind(copy),
    services: () => Array.from(copy.entries()) as any,
  };
};
