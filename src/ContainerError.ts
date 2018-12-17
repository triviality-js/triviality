export class ContainerError extends Error {

  public static propertyOrServiceAlreadyDefined(name: string) {
    return new this(`Containers service or property already defined "${name}"`);
  }

  public static containerIsLocked(name: string) {
    return new this(`Container is locked and cannot be altered. (Tried to change "${name}")`);
  }

  public static containerAlreadyBuild() {
    return new this('Container already been build');
  }

  public static registerShouldAllReturnSameType() {
    return new this('Register should return same type');
  }

  public static wrongRegisterReturnType() {
    return new this('Register should return array, object or nothing (void)');
  }
}
