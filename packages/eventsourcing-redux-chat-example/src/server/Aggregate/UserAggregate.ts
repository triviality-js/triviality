import { UserId } from '../../shared/ValueObject/UserId';
import { UserHasRegistered } from '../DomainEvent/UserHasRegistered';
import { Assert } from '../../shared/Assert';
import { EventSourcedAggregateRoot } from 'ts-eventsourcing/EventSourcing/EventSourcedAggregateRoot';

export class UserAggregate extends EventSourcedAggregateRoot<UserId> {

  public static registerUser(id: UserId, name: string, passwordHash: string) {
    const instance = new this(id);
    Assert.assertUserName(name);
    instance.apply(new UserHasRegistered(name, passwordHash));
    return instance;
  }

}
