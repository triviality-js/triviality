import { SerializerInterface } from 'ts-eventsourcing/Serializer/SerializerInterface';

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
