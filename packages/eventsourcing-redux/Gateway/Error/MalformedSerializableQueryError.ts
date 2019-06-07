export class MalformedSerializableQueryError extends Error {

  public static notASerializableQuery(query: unknown) {
    return new this('Query is not of type SerializableQuery', query);
  }

  constructor(message: string, public query: unknown) {
    super(message);
  }

}
