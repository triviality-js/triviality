
export class SerializerError extends Error {

  public static fromError(error: Error) {
    if (error instanceof this) {
      return error;
    }
    const instance = new SerializerError(error.message, error);
    return instance;
  }

  /* istanbul ignore next */
  constructor(message: string, private readonly originalError?: Error) {
    super(message);
    this.originalError = originalError;
    Object.setPrototypeOf(this, SerializerError.prototype);
  }

  public getOriginalError(): Error {
    return this.originalError || this;
  }

}
