
export interface ValueStoreInterface<T> {

  get(): T;

  tap(): T | null;

  set(value: T): void;

  has(): boolean;

  delete(): void;
}
