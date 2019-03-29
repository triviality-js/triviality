export class NameInvalidError extends Error {

  public static doesNotMatchCriteria() {
    return new this('Name does not match the expected criteria');
  }

}
