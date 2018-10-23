import { ChatChannelId } from '../../shared/ValueObject/ChatChannelId';

export class InvalidChannelIdError extends Error {

  public static notUuid4(chatChannelId: ChatChannelId) {
    return `${chatChannelId} is not an valid uuid version 4`;
  }
}
