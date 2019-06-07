import { StoreError } from './Error/StoreError';
import { KeyValueStoreInterface } from './KeyValueStoreInterface';

export class MapKeyValueStore<T, K = string> implements KeyValueStoreInterface<T, K> {

  constructor(private storage = new Map<K, T>()) {

  }

  public get(key: K): T {
    if (!this.has(key)) {
      throw StoreError.missingValueForKey(`${key}`);
    }
    return this.storage.get(key) as T;
  }

  public set(key: K, value: T): this {
    this.storage.set(key, value);
    return this;
  }

  public clear(): this {
    this.storage.clear();
    return this;
  }

  public delete(key: K): this {
    this.storage.delete(key);
    return this;
  }

  public find(key: K, defaultValue: T | null = null): T | null {
    if (!this.has(key)) {
      return defaultValue;
    }
    return this.storage.get(key) as T;
  }

  public has(key: K): boolean {
    return this.storage.has(key);
  }

}
