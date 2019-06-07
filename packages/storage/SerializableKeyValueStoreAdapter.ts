import { SerializerInterface } from '@triviality/serializer';
import { StoreError } from './Error/StoreError';
import { KeyValueStoreInterface } from './KeyValueStoreInterface';

export class SerializableKeyValueStoreAdapter<T, K = string> implements KeyValueStoreInterface<T, K> {

  constructor(private serializer: SerializerInterface, private storage: KeyValueStoreInterface<string, K>) {

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
    return this.get(key);
  }

  public get(key: K): T {
    if (!this.has(key)) {
      throw StoreError.missingValueForKey(`${key}`);
    }
    const value = this.storage.get(key);
    try {
      return this.serializer.deserialize(value) as T;
    } catch (e) {
      throw StoreError.fromError(e);
    }
  }

  public has(key: K): boolean {
    return this.storage.has(key);
  }

  public set(key: K, value: T): this {
    let serialized: string | undefined;
    try {
      serialized = this.serializer.serialize(value);
    } catch (e) {
      throw StoreError.fromError(e);
    }
    this.storage.set(key, serialized);
    return this;
  }

}

export function serializeValue<T, K = string>(serializer: SerializerInterface, storage: KeyValueStoreInterface<string, K>) {
  return new SerializableKeyValueStoreAdapter<T, K>(serializer, storage);
}
