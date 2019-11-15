import { map } from 'ramda';

export type ServiceFactory<T = unknown> = () => T;
export type SF<T = unknown> = ServiceFactory<T>;

export const isServiceFactory = (target: unknown): target is SF<unknown> => {
  return typeof target === 'function' && target.length === 0;
};
export const serviceOfServiceFactory = <T>(sf: ServiceFactory<T>): T => sf();
export const serviceOfServiceFactories = <T>(factories: Array<ServiceFactory<T>>): T[] => map(
  serviceOfServiceFactory, factories);

export type ServicesAsFactories<Services> = {
  [K in keyof Services]: SF<Services[K]>;
};

export type ServiceTag = string;
export type TagServicePair<T = unknown> = [ServiceTag, SF<T>];
export const isServiceTag = (target: unknown): target is ServiceTag => typeof target === 'string';

export type ServiceFactoryByTag<T = unknown> = (tag: ServiceTag) => SF<T>;

export type ServiceFactoriesOfType<Services, TType> = {
  [K in keyof Services]: Services[K] extends SF<TType> ? Services[K] : never;
};

export type ServicesOfType<Services, TType> = {
  [K in keyof Services]: Services[K] extends TType ? Services[K] : never;
};

export type ServiceFactoryKeysOfType<Services, TType> = keyof ServiceFactoriesOfType<Services, TType>;
export type ServiceKeysOfType<Services, TType> = keyof ServicesOfType<Services, TType>;
