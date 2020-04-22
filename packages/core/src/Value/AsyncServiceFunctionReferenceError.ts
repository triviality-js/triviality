export class AsyncServiceFunctionReferenceError {
  public readonly stack = new Error();
  constructor(public readonly wait: () => Promise<void>) {
  }
}
