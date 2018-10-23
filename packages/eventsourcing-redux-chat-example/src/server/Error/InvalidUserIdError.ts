import { UserId } from '../../shared/ValueObject/UserId';

export class InvalidUserIdError extends Error {

  public static notUuid4(userId: UserId) {
    return `${userId} is not an valid uuid version 4`;
  }
}
