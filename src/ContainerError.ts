export class ContainerError extends Error {

  public static propertyOrServiceAlreadyDefined(name: string) {
    return new this(`Containers service or property already defined "${name}"`);
  }

  public static containerIsLocked(name: string) {
    return new this(`Container is locked and cannot be altered. (Tried to change "${name}")`);
  }

  public static containerAlreadyBuild() {
    return new this('Container is been build');
  }

  public static wrongRegisterReturnType(name: string) {
    return new this(`Register "${name}" should return array or nothing at all`);
  }
}
