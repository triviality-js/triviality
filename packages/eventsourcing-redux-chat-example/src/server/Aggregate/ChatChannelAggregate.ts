import { UserHasRegistered } from '../DomainEvent/UserHasRegistered';
import { ChatChannelId } from '../../shared/ValueObject/ChatChannelId';
import { Assert } from '../../shared/Assert';
import { EventSourcedAggregateRoot } from 'ts-eventsourcing/EventSourcing/EventSourcedAggregateRoot';

export class ChatChannelAggregate extends EventSourcedAggregateRoot<ChatChannelId> {

  public static createChannel(id: ChatChannelId, name: string) {
    const instance = new this(id);
    Assert.assertChannelName(name);
    instance.apply(new UserHasRegistered(name));
    return instance;
  }

}
