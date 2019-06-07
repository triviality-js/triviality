
export class DeserializationError extends Error {

  public static eventCouldNotBeDeSerialized(event: any, error: Error) {
    return new this('Event could not be de-serialized', event, error);
  }

  public static commandCouldNotBeDeSerialized(command: any, error: Error) {
    return new this('Command could not be de-serialized', command, error);
  }

  public static queryCouldNotBeDeSerialized(query: any, error: Error) {
    return new this('Query could not be de-serialized', query, error);
  }

  constructor(message: string, public readonly json: unknown, public readonly orginalError?: Error) {
    super(message);
  }

}
