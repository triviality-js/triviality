import { KeyValueStoreInterface } from './KeyValueStoreInterface';

export class MapKeyValueStoreAdapter<T, K = string, TK = K> implements KeyValueStoreInterface<T, K> {

  constructor(private storage: KeyValueStoreInterface<T, TK>, private map: (key: K) => TK) {

  }

  public clear(): this {
    this.storage.clear();
    return this;
  }

  public delete(key: K): this {
    this.storage.delete(this.map(key));
    return this;
  }

  public find(key: K, defaultValue: T | null = null): T | null {
    return this.storage.find(this.map(key), defaultValue);
  }

  public get(key: K): T {
    return this.storage.get(this.map(key));
  }

  public has(key: K): boolean {
    return this.storage.has(this.map(key));
  }

  public set(key: K, value: T): this {
    this.storage.set(this.map(key), value);
    return this;
  }

}

export function mapKey<T, K = string, TK = K>(storage: KeyValueStoreInterface<T, TK>, map: (key: K) => TK) {
  return new MapKeyValueStoreAdapter<T, K, TK>(storage, map);
}
