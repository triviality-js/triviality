import { KeyValueStoreInterface } from '../KeyValueStoreInterface';

export class DefaultKeyValueStoreAdapter<T, K = string> implements KeyValueStoreInterface<T, K> {

  public constructor(private storage: KeyValueStoreInterface<T, K>, private value: (key: K) => T) {

  }

  public clear(): void {
    this.storage.clear();
  }

  public delete(key: K): void {
    this.storage.delete(key);
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

  public set(key: K, value: T): void {
    this.storage.set(key, value);
  }

}

export function defaultValue<T, K = string>(storage: KeyValueStoreInterface<T, K>, value: (key: K) => T) {
  return new DefaultKeyValueStoreAdapter(storage, value);
}
