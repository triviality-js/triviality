import { Registry } from './Registry';
import { REGISTER_LIST_ARGUMENTS } from './RegistryListContext';

export class ImmutableRegistryList<T> extends Array<T> implements Registry<T> {

  public static create<T>(...items: T[]): ImmutableRegistryList<T> {
    const instance: ImmutableRegistryList<T> = Object.create(ImmutableRegistryList.prototype);
    instance.splice(0, 0, ...items);
    Object.freeze(instance);
    return instance;
  }

  public [REGISTER_LIST_ARGUMENTS]!: T;

  /* istanbul ignore next */
  private constructor() {
    super();
  }

  public register(...args: T[]): ImmutableRegistryList<T> {
    return ImmutableRegistryList.create(...[...this, ...args]);
  }

  public toArray(): T[] {
    return [...this];
  }
}

export type RegistryList<T> = ImmutableRegistryList<T>;

export const makeImmutableRegistryList = ImmutableRegistryList.create;
