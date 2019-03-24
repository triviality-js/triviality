import { StoreError } from './Error/StoreError';
import { KeyValueStoreInterface } from './KeyValueStoreInterface';

export class MapKeyValueStoreAdapter<T, K = string> implements KeyValueStoreInterface<T, K> {

  constructor(private storage = new Map<K, T>()) {

  }

  public get(key: K): T {
    if (!this.has(key)) {
      throw StoreError.missingValueForKey(`${key}`);
    }
    return this.storage.get(key) as T;
  }

  public set(key: K, value: T): void {
    this.storage.set(key, value);
  }

  public clear(): void {
    this.storage.clear();
  }

  public delete(key: K): void {
    this.storage.delete(key);
  }

  public find(key: K): T | null {
    if (!this.has(key)) {
      return null;
    }
    return this.storage.get(key) as T;
  }

  public has(key: K): boolean {
    return this.storage.has(key);
  }

}
