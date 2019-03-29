import { KeyValueStore } from './KeyValueStore';
import { StateStorageInterface } from './StateStorageInterface';

export class ValueStore<T> implements StateStorageInterface<T> {

  constructor(private store: KeyValueStore<T>, private key: string) {

  }

  public get(): T | null {
    return this.store.get(this.key);
  }

  public set(value: T): void {
    return this.store.set(this.key, value);
  }

}
