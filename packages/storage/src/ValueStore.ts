import { ValueStoreInterface } from './ValueStoreInterface';
import { KeyValueStoreInterface } from './KeyValueStoreInterface';

export class ValueStore<T> implements ValueStoreInterface<T> {

  constructor(private store: KeyValueStoreInterface<T>, private key: string) {

  }

  public get(): T {
    return this.store.get(this.key);
  }

  public set(value: T): void {
    return this.store.set(this.key, value);
  }

  public delete(): void {
    this.store.delete(this.key);
  }

  public has(): boolean {
    return this.store.has(this.key);
  }

  public tap(): T | null {
    return this.store.find(this.key);
  }

}
