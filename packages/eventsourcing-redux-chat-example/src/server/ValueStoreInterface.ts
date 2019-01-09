
export interface ValueStoreInterface<T> {

  get(): T | null;

  set(value: T): void;

}
