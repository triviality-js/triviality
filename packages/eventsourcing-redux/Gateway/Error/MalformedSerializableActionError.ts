
export class MalformedSerializableActionError extends Error {

  public static notASerializableAction(action: unknown) {
    return new this('Action is not an valid', action);
  }

  constructor(message: string, public event: unknown) {
    super(message);
  }

}
