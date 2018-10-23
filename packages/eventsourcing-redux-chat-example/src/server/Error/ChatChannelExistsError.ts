import { UserId } from '../../shared/ValueObject/UserId';

export class ChatChannelExistsError extends Error {

  public static withId(id: UserId) {
    return new this(`Chat channel with ${id.toString()} already exists`);
  }

}
