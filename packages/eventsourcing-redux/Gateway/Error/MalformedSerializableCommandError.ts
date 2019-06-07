export class MalformedSerializableCommandError extends Error {

  public static notASerializableCommand(command: unknown) {
    return new this('Command is not of type SerializableCommand', command);
  }

  constructor(message: string, public command: unknown) {
    super(message);
  }

}
