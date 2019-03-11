
export interface SerializerInterface {

  serialize(data: unknown): string;

  deserialize(serialized: string): unknown;
}
