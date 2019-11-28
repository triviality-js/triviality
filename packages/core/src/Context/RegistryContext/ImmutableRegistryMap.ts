import { Registry } from './Registry';
import { fromPairs } from 'ramda';

export type RegistryMap<TType, TKey = string> = ImmutableRegistryMap<TType, TKey>;

export function makeImmutableRegistryMap<TType, TKey = string>(...services: Array<[TKey, TType]>): ImmutableRegistryMap<TType, TKey> {
  return ImmutableRegistryMap.create(...services);
}

export class ImmutableRegistryMap<TType, TKey = string> extends Array<[TKey, TType]> implements Registry<[TKey, TType]> {

  public static create<TType, TKey = string>(...items: Array<[TKey, TType]>): ImmutableRegistryMap<TType, TKey> {
    const instance: ImmutableRegistryMap<TType, TKey> = Object.create(ImmutableRegistryMap.prototype);
    const map = new Map(items);
    map.forEach((value, key) => {
      instance.push([key, value]);
    });
    Object.freeze(instance);
    return instance;
  }

  /* istanbul ignore next */
  private constructor() {
    super();
  }

  public register(...services: Array<[TKey, TType]>): ImmutableRegistryMap<TType, TKey> {
    return ImmutableRegistryMap.create<TType, TKey>(...[...this, ...services]);
  }

  public toArray() {
    return [...this];
  }

  public toObject(): TKey extends string | symbol | number ? Record<TKey, TType> : never {
    return fromPairs(this as any) as any;
  }
}
