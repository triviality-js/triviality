
export class ContainerError extends Error {

  public static propertyOrServiceAlreadyDefined(name: string) {
    return new this(`Containers service or property already defined "${name}"`);
  }

  public static containerIsLocked() {
    return new this('Container is locked and cannot be altered.');
  }

}
