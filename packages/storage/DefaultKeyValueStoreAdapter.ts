import { KeyValueStoreInterface } from './KeyValueStoreInterface';

export class DefaultKeyValueStoreAdapter<T, K = string> implements KeyValueStoreInterface<T, K> {

  public constructor(private storage: KeyValueStoreInterface<T, K>, private value: (key: K) => T) {

  }

  public clear(): this {
    this.storage.clear();
    return this;
  }

  public delete(key: K): this {
    this.storage.delete(key);
    return this;
  }

  public find(key: K): T {
    return this.get(key);
  }

  public get(key: K): T {
    if (!this.has(key)) {
      this.set(key, this.value(key));
    }
    return this.storage.get(key);
  }

  public has(key: K): boolean {
    return this.storage.has(key);
  }

  public set(key: K, value: T): this {
    this.storage.set(key, value);
    return this;
  }

}

export function defaultValue<T, K = string>(storage: KeyValueStoreInterface<T, K>, value: (key: K) => T) {
  return new DefaultKeyValueStoreAdapter(storage, value);
}
