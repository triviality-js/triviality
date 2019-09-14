
export class ContainerError extends Error {

  public static throwIsLocked(): never {
    throw ContainerError.containerIsLocked();
  }

  public static containerIsLockedDuringBuild() {
    return new this('Container is locked. Cannot get or set services during build time.');
  }

  public static serviceAlreadyDefined(name: string) {
    return new this(`service already defined "${name}"`);
  }

  public static cannotOverrideNonExistingService(name: string) {
    return new this(`Cannot override none existing service "${name}"`);
  }

  public static containerIsLocked() {
    return new this('Container is locked and cannot be altered.');
  }

  public static isNotAServiceFunction(name: string) {
    return new this(`Feature factory Key "${name}" is not a service function`);
  }

}
