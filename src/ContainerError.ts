export class ContainerError extends Error {

  public static throwIsLockedDuringBuild() {
    throw ContainerError.containerIsLockedDuringBuild();
  }

  public static throwIsLocked() {
    throw ContainerError.containerIsLocked();
  }

  public static containerIsLockedDuringBuild() {
    return new this('Container is locked. Cannot get or set services during build time.');
  }

  public static propertyOrServiceAlreadyDefined(name: string) {
    return new this(`Containers service or property already defined "${name}"`);
  }

  public static cannotAddExtraService(name: string) {
    return new this(`Cannot add extra service "${name}" with serviceOverrides`);
  }

  public static containerIsLocked() {
    return new this('Container is locked and cannot be altered.');
  }

  public static containerAlreadyBuild() {
    return new this('Container already been build');
  }

  public static registerShouldAllReturnSameType() {
    return new this('Register with same name should return the same type');
  }

  public static wrongRegisterReturnType() {
    return new this('Register return type should be an array or object');
  }

  public static shouldReturnNewObjectWithServices() {
    return new this('serviceOverrides should return new object with services');
  }
}
