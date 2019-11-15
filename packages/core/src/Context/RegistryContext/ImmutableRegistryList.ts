import { Registry } from './Registry';

export interface ImmutableRegistryList<T> extends Registry<T> {
  register(...args: T[]): this;
}

export type RegistryList<T> = ImmutableRegistryList<T>;

export function makeImmutableRegistryList<Type>(...services: Type[]): RegistryList<Type> {
  const items: Type[] = [...services];
  const instance: RegistryList<Type> = (() => instance.toArray()) as any;
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
  instance.toArray = () => items;

  instance.register = (...args: Type[]) => makeImmutableRegistryList(...[...items, ...args]);
  return instance;
}
