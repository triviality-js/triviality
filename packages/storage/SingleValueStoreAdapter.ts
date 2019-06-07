import { ValueStoreInterface } from './ValueStoreInterface';
import { KeyValueStoreInterface } from './KeyValueStoreInterface';

export class SingleValueStoreAdapter<T, K = string> implements ValueStoreInterface<T> {

  constructor(private store: KeyValueStoreInterface<T, K>, private key: K) {

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

export function singleValue<T, K = string>(store: KeyValueStoreInterface<T, K>, key: K) {
  return new SingleValueStoreAdapter(store, key);
}
