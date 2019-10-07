import { always, is, isEmpty } from 'ramda';
import { ServiceFactory, SF } from '../../ServiceFactory';

export interface RegistryList<T> extends Iterable<T> {
  (): T[];

  register(items: Array<ServiceFactory<T>>): this;

  register(...items: Array<ServiceFactory<T>>): this;

  register(items: () => T[]): this;

  /**
   * TODO: split this type.
   */
  register<Tags>(services: (tags: Tags) => [ServiceFactory<T>], ...tags: Tags[]): this;
}

function makeRegisterList<Type>(services: Array<SF<Type>> = []): RegistryList<Type> {
  const items: Type[] = [...services.map((service) => service())];
  const instance: RegistryList<Type> = (() => items) as any;

  instance[Symbol.iterator] = () => {
    let pointer = 0;
    return {
      next(): IteratorResult<Type> {
        if (pointer < items.length) {
          const result = {
            done: false,
            value: items[pointer] as Type,
          };
          pointer += 1;
          return result;
        }
        return {
          done: true,
          value: null as any,
        };
      },
    };
  };

  instance.register = (...args: any[]) => {
    items.push(...registerList<Type>(...args));
    return instance;
  };
  return instance;
}

export function registerList<T>(): RegistryList<T>;
export function registerList<T>(items: Array<ServiceFactory<T>>): RegistryList<T>;
export function registerList<T>(...items: Array<ServiceFactory<T>>): RegistryList<T>;
export function registerList<T>(items: () => T[]): RegistryList<T>;
export function registerList<T, Tags>(services: (tags: Tags) => [ServiceFactory<T>], ...tags: Tags[]): RegistryList<T>;
export function registerList<T>(...args: any[]): RegistryList<T> {
  if (isEmpty(args)) {
    return makeRegisterList();
  }
  if (isFeatureFactoryArray<T>(args)) {
    return makeRegisterList(args[0]);
  }
  if (isInstanceFeatureFactory<T>(args)) {
    return makeRegisterList(args[0]().map((service) => always(service)));
  }
  const servicesByTags: (tags: string) => [SF<T>] = args[0];
  return makeRegisterList<T>(args.slice(1).map((service) => {
    return servicesByTags(service)[0];
  }));
}

function isFeatureFactoryArray<T>(args: any): args is [Array<SF<T>>] {
  return is(Array, args[0]) && args.length === 1;
}

function isInstanceFeatureFactory<T>(args: any): args is [() => T[]] {
  return typeof args[0] === 'function' && args.length === 1;
}
