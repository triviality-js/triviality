import { ValueStoreInterface } from './ValueStoreInterface';
import { KeyValueStoreInterface } from './KeyValueStoreInterface';

export class ValueStore<T> implements ValueStoreInterface<T> {

  constructor(private store: KeyValueStoreInterface<T>, private key: string) {

  }

  public get(): T {
    return this.store.get(this.key);
  }

  public set(value: T): this {
    this.store.set(this.key, value);
    return this;
  }

  public delete(): this {
    this.store.delete(this.key);
    return this;
  }

  public has(): boolean {
    return this.store.has(this.key);
  }

  public tap(defaultValue: T | null = null): T | null {
    return this.store.find(this.key, defaultValue);
  }

}
