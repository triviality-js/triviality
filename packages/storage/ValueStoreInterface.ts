export interface ValueStoreInterface<T> {

  get(): T;

  tap(): T | null;

  set(value: T): this;

  has(): boolean;

  delete(): this;
}
