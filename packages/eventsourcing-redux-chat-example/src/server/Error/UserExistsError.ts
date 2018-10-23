import { UserId } from '../../shared/ValueObject/UserId';

export class UserExistsError extends Error {

  public static withId(id: UserId) {
    return new this(`User with ${id.toString()} already exists`);
  }

}
