import { ChatChannelId } from '../../shared/ValueObject/ChatChannelId';

export class CreateChannelCommand {

  constructor(public readonly id: ChatChannelId, public name: string) {

  }

}
