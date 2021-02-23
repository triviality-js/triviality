
export interface SerializerInterface<T = unknown> {

  serialize(data: T): string;

  deserialize(serialized: string): T;
}
