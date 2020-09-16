import { always, map } from 'ramda';

export type ServiceFactory<T = unknown> = () => T;
export type SF<T = unknown> = ServiceFactory<T>;

export const assetServiceFactory = (sf: unknown): sf is SF | never => {
  if (typeof sf !== 'function') {
    throw new Error('ServiceFactory is not a function');
  }
  if (sf.length > 0) {
    throw new Error(`ServiceFactory '${sf.name}' cannot have any arguments`);
  }
  return true;
};

export const isServiceFactory = (target: unknown): target is SF<unknown> => {
  return typeof target === 'function' && target.length === 0;
};
export const serviceOfServiceFactory = <T>(sf: ServiceFactory<T>): T => sf();
export const serviceOfServiceFactories = <T>(factories: ServiceFactory<T>[]): T[] => map(
  serviceOfServiceFactory, factories);

export type ServicesAsFactories<Services> = {
  [K in keyof Services]: SF<Services[K]>;
};

export const assertServiceTag = (tag: unknown): tag is (string | never) => {
  if (typeof tag !== 'string' || tag === '') {
    throw new Error('Tag should be a one empty string');
  }
  return true;
};

export type ServicesOfType<Services, TType> = {
  [K in keyof Services]: Services[K] extends TType ? Services[K] : never;
};

export type ServiceKeysOfType<Services, TType> = keyof ServicesOfType<Services, TType>;

export const AllAsServiceFactory = <T>(instances: T[]): SF<T>[] => instances.map(always);
