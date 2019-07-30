
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

  public static cannotDynamicallyOverrideExtraService(name: string) {
    return new this(`Cannot dynamically override services "${name}"`);
  }

  public static containerIsLocked() {
    return new this('Container is locked and cannot be altered.');
  }

  public static registerShouldAllReturnSameType() {
    return new this('Register with same name should return the same type');
  }

  public static wrongRegisterReturnType() {
    return new this('Register return type should be an array or object');
  }

  public static serviceNotAFunction(name: string) {
    return new this(`Feature factory Key ${name} is not a service function`);
  }

  public static registriesShouldBeAnObject() {
    return new this('Registries should be a object');
  }
}
