import { SerializerInterface } from '@triviality/serializer';
import { StoreError } from './Error/StoreError';
import { KeyValueStoreInterface } from './KeyValueStoreInterface';

export class SerializableKeyValueStoreAdapter<T, K = string> implements KeyValueStoreInterface<T, K> {

  constructor(private serializer: SerializerInterface, private storage: KeyValueStoreInterface<string, K>) {

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

  public set(key: K, value: T): void {
    let serialized: string | undefined;
    try {
      serialized = this.serializer.serialize(value);
    } catch (e) {
      throw StoreError.fromError(e);
    }
    this.storage.set(key, serialized);
  }

}
