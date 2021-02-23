import { SerializerInterface } from '../SerializerInterface';

export class JSONSerializer implements SerializerInterface {

  constructor(private beautify: boolean = true) {

  }

  public deserialize(serialized: string): unknown {
    return JSON.parse(serialized);
  }

  public serialize(data: unknown): string {
    if (this.beautify) {
      return JSON.stringify(data, null, '  ');
    }
    return JSON.stringify(data);
  }

}
