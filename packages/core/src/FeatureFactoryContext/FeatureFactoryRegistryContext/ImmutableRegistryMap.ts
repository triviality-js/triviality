import { ServiceTag } from '../../ServiceFactory';
import { Registry } from './Registry';

export type RegistryTag = string;

export interface ImmutableRegistryMap<T> extends Registry<[ServiceTag, T]> {
  register(...items: Array<[RegistryTag, T]>): this;
}

export type MapRegistries<Services, TType> = {
  [K in keyof Services]: Services[K] extends () => ImmutableRegistryMap<TType> ? Services[K] : never;
};

export type RegistryMap<T> = ImmutableRegistryMap<T>;

export function makeImmutableRegistryMap<Type>(...services: Array<[ServiceTag, Type]>): ImmutableRegistryMap<Type> {
  const items: Map<ServiceTag, Type> = new Map([...services]);
  const instance: ImmutableRegistryMap<Type> = (() => instance.toArray()) as any;
  instance[Symbol.iterator] = () => items.entries();
  instance.toArray = () => Array.from(items.entries());
  instance.register = (...s: Array<[ServiceTag, Type]>) => makeImmutableRegistryMap(...[...items.entries(), ...s]);
  return instance;
}
