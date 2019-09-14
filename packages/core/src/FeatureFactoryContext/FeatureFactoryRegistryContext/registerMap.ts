import { always, is, isEmpty } from 'ramda';
import { ServiceFactory, ServiceTag, SF } from '../types';

export type RegistryTag = string;

export interface RegistryMap<T> extends Iterable<[ServiceTag, T]> {
  (): Map<ServiceTag, T>;

  register(items: Map<RegistryTag, SF<T>>): this;

  register(items: { [key: string]: SF<T> }): this;

  register(items: Array<[RegistryTag, SF<T>]>): this;

  register(items: () => (Array<[RegistryTag, T]> | { [key: string]: T } | Map<RegistryTag, T>)): this;

  /**
   * register(services, ['your tag 1', 'serviceName 1'], ['your tag 2', 'serviceName2'], ...etc)
   */
  register<Tags>(services: (tag: Tags) => [ServiceFactory<T>], ...toRegister: Array<[RegistryTag, Tags]>): this;

  /**
   * register(services, {tag1: 'service1'})
   */
  register<Tags>(services: (tags: Tags) => [ServiceFactory<T>], toRegister: { [tags: string]: Tags }): this;
}

function makeRegisterMap<Type>(services: Array<[ServiceTag, SF<Type>]> = []): RegistryMap<Type> {
  const items: Map<ServiceTag, Type> = new Map(services.map(([tag, sf]) => [tag, sf()]));
  const instance: RegistryMap<Type> = (() => items) as any;

  instance[Symbol.iterator] = () => {
    return items.entries();
  };

  instance.register = (...args: any[]) => {
    for (const [tag, service] of (registerMap as any)(...args)) {
      items.set(tag, service);
    }
    return instance;
  };
  return instance as any;
}

export function registerMap<T>(): RegistryMap<T>;
export function registerMap<T>(items: Map<RegistryTag, SF<T>>): RegistryMap<T>;
export function registerMap<T>(items: { [key: string]: SF<T> }): RegistryMap<T>;
export function registerMap<T>(items: Array<[RegistryTag, SF<T>]>): RegistryMap<T>;
export function registerMap<T>(items: () => (Array<[RegistryTag, T]> | { [key: string]: T } | Map<RegistryTag, T>)): RegistryMap<T>;
/**
 * registerMap(services, ['your tag 1', 'serviceName 1'], ['your tag 2', 'serviceName2'], ...etc)
 */
export function registerMap<T, Tags>(services: (tag: Tags) => [ServiceFactory<T>], ...toRegister: Array<[RegistryTag, Tags]>): RegistryMap<T>;
/**
 * registerMap(services, {tag1: 'service1'})
 */
export function registerMap<T, Tags>(services: (tags: Tags) => [ServiceFactory<T>], toRegister: { [tags: string]: Tags }): RegistryMap<T>;
export function registerMap<Type>(...args: any[]): RegistryMap<Type> {
  if (isEmpty(args)) {
    return makeRegisterMap();
  }
  if (isFeatureFactoryMap<Type>(args)) {
    return makeRegisterMap([...args[0].entries()]);
  }
  if (isFeatureFactoryArray<Type>(args)) {
    return makeRegisterMap(args[0]);
  }
  if (isInstanceFeatureFactory<Type>(args)) {
    const instances: any = args[0]();
    if (typeof instances[Symbol.iterator] === 'function') {
      return makeRegisterMap([...instances].map(([tag, service]) => [tag, always(service)]));
    }
    return makeRegisterMap(Object.entries(instances).map(([tag, service]: any) => [tag, always(service)]));
  }
  if (isFeatureFactoryTaggedServiceArray<Type>(args)) {
    const servicesByTags = args[0] as any;
    const services: Array<[ServiceTag, SF<Type>]> = args.slice(1) as any;
    return makeRegisterMap<Type>(services.map(([tag, key]) => [tag, servicesByTags(key)[0]]));
  }
  if (isFeatureFactoryTaggedServiceObject<Type>(args)) {
    const servicesByTags = args[0] as any;
    const services: { [tag: string]: ServiceTag } = args[1] as any;
    const entries = Object.entries(services);
    return makeRegisterMap<Type>(entries.map(([tag, key]) => [tag, servicesByTags(key)[0]]));
  }
  return makeRegisterMap(Object.entries(args[0]));
}

function isFeatureFactoryMap<Type>(args: any): args is [Map<ServiceTag, SF<Type>>] {
  return is(Map, args[0]) && args.length === 1;
}

function isFeatureFactoryArray<Type>(args: any): args is [Array<[RegistryTag, SF<Type>]>] {
  return is(Array, args[0]) && args.length === 1;
}

function isFeatureFactoryTaggedServiceArray<Type>(args: any): args is [(...tags: ServiceTag[]) => Array<() => Type>, [ServiceTag, SF<Type>]] {
  return typeof args[0] === 'function' && args.length >= 1 && is(Array, args[1]);
}

function isFeatureFactoryTaggedServiceObject<Type>(args: any): args is [(...tags: ServiceTag[]) => Array<() => Type>, { [tag: string]: ServiceTag }] {
  return typeof args[0] === 'function' && args.length === 2 && is(Object, args[1]);
}

function isInstanceFeatureFactory<Type>(args: any): args is [() => (Array<[RegistryTag, Type]> | { [key: string]: Type } | Map<RegistryTag, Type>)] {
  return typeof args[0] === 'function' && args.length === 1;
}
