
export class StoreError extends Error {

  public static fromError(error: Error) {
    if (error && error instanceof StoreError) {
      return error;
    }
    return new StoreError(error.message, error);
  }

  public static missingValueForKey(key: string) {
    return new this(`No value in store for ${key}`);
  }

  /* istanbul ignore next */
  constructor(message: string, private readonly originalError?: Error) {
    super(message);
    this.originalError = originalError;
    Object.setPrototypeOf(this, StoreError.prototype);
  }

  public getOriginalError(): Error {
    return this.originalError || this;
  }

}
