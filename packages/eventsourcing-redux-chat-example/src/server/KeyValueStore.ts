import { SerializerInterface } from '@triviality/serializer';

export interface KeyValueStore<T> {
  get(key: string): T | null;

  set(key: string, value: T): void;
}

export class KeyValueStore<T> {

  constructor(private serializer: SerializerInterface) {

  }

  public get(key: string): T | null {
    const item = localStorage.getItem(key);
    if (typeof item !== 'string') {
      return null;
    }
    return this.serializer.deserialize(item) as any;
  }

  public set(key: string, value: T): void {
    const serialized = this.serializer.serialize(value);
    localStorage.setItem(key, serialized);
  }

}
