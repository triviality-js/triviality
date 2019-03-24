import { StoreError } from '../Error/StoreError';
import { KeyValueStoreInterface } from '../KeyValueStoreInterface';

export class DomStorageStoreAdapter implements KeyValueStoreInterface<string, string> {

  public constructor(private storage: Storage) {

  }

  public clear(): void {
    this.storage.clear();
  }

  public delete(key: string): void {
    this.storage.removeItem(key);
  }

  public find(key: string): string | null {
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

  public set(key: string, value: string): void {
    this.storage.setItem(key, value);
  }

}
