export class ServiceContainerError extends Error {
  constructor(message: string, originalError?: Error) {
    super(message);
    this.originalError = originalError;
    Object.setPrototypeOf(this, ServiceContainerError.prototype);
  }
}
