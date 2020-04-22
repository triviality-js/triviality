import { Registry } from './Registry';
import { REGISTER_LIST_ARGUMENTS } from './ImmutableRegistryList';

export class ImmutableRegistrySet<T> extends Array<T> implements Registry<T> {
  public static create<T>(...items: readonly T[]): ImmutableRegistrySet<T> {
    const instance: ImmutableRegistrySet<T> = Object.create(ImmutableRegistrySet.prototype);
    const set = new Set(items);
    set.forEach((item) => instance.push(item));
    Object.freeze(instance);
    return instance;
  }

  public [REGISTER_LIST_ARGUMENTS]!: T;

  /* istanbul ignore next */
  private constructor() {
    super();
  }

  public register(...args: T[]): ImmutableRegistrySet<T> {
    return ImmutableRegistrySet.create(...[...this, ...args]);
  }

  public toArray(): T[] {
    return [...this];
  }
}

export type RegistrySet<T> = ImmutableRegistrySet<T>;

export const makeImmutableRegistrySet = ImmutableRegistrySet.create;
