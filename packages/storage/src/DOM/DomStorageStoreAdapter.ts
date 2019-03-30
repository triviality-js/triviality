import { StoreError } from '../Error/StoreError';
import { KeyValueStoreInterface } from '../KeyValueStoreInterface';

export class DomStorageStoreAdapter implements KeyValueStoreInterface<string, string> {

  public constructor(private storage: Storage) {

  }

  public clear(): this {
    this.storage.clear();
    return this;
  }

  public delete(key: string): this {
    this.storage.removeItem(key);
    return this;
  }

  public find(key: string, defaultValue: string | null = null): string | null {
    if (this.has(key)) {
      return defaultValue;
    }
    return this.storage.getItem(key);
  }

  public get(key: string): string {
    if (!this.has(key)) {
      throw StoreError.missingValueForKey(key);
    }
    return this.storage.get(key) as string;
  }

  public has(key: string): boolean {
    return this.storage.getItem(key) !== null;
  }

  public set(key: string, value: string): this {
    this.storage.setItem(key, value);
    return this;
  }

}
