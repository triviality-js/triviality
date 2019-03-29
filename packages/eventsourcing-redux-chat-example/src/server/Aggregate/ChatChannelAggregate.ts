import { EventSourcedAggregateRoot } from '@triviality/eventsourcing/EventSourcing/EventSourcedAggregateRoot';
import { Assert } from '../../shared/Assert';
import { ChatChannelId } from '../../shared/ValueObject/ChatChannelId';

export class ChatChannelAggregate extends EventSourcedAggregateRoot<ChatChannelId> {

  public static createChannel(id: ChatChannelId, name: string) {
    const instance = new this(id);
    Assert.assertChannelName(name);
    return instance;
  }

}
