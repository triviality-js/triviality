import { once } from 'ramda';
import { ServiceTag, SF } from '../ServiceFactory';

export interface ImmutableContainer {
  getService(k: ServiceTag): SF<unknown>;

  setService(k: ServiceTag, sf: SF<unknown>): this;

  services(): [[ServiceTag, SF]];

  hasService(k: ServiceTag): boolean;
}

export const hasService = (container: Map<string, SF>) => (k: string): boolean => container.has(k);

export const getServices = (getService: (k: ServiceTag) => SF) => (tags: ServiceTag[]): [[ServiceTag, SF<unknown>]] =>
  (tags.map<[ServiceTag, SF]>((tag) => [tag, getService(tag)]) as any);

export const getServiceFromContainer = (container: Map<string, SF>) => (k: string): SF => {
  const service = container.get(k);
  if (!service) {
    throw new Error(`Service '${k}' not found`);
  }
  return service;
};

export const setServiceToContainer = (container: Map<string, SF>) => (k: string, sf: SF): ImmutableContainer => {
  if (typeof sf !== 'function' || sf.length > 0) {
    throw new Error(`ServiceFactory '${k}' cannot have any arguments`);
  }
  const copy = new Map<string, SF<unknown>>(container.entries());
  copy.set(k.toString(), once(sf));
  return createImmutableContainer(copy);
};

export const createImmutableContainer = (container = new Map<string, SF<unknown>>()): ImmutableContainer => {
  const copy = new Map<string, SF<unknown>>(container.entries());
  const getService = getServiceFromContainer(copy);
  const services = getServices(getService);
  return {
    getService,
    setService: setServiceToContainer(copy),
    hasService: hasService(copy),
    services: () => services(Array.from(copy.keys())),
  };
};
