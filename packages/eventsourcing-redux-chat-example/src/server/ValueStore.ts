import { KeyValueStore } from './KeyValueStore';
import { ValueStoreInterface } from './ValueStoreInterface';

export class ValueStore<T> implements ValueStoreInterface<T> {

  constructor(private store: KeyValueStore<T>, private key: string) {

  }

  public get(): T | null {
    return this.store.get(this.key);
  }

  public set(value: T): void {
    return this.store.set(this.key, value);
  }

}
