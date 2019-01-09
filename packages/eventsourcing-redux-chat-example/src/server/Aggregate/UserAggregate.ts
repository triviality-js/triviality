import { UserId } from '../../shared/ValueObject/UserId';
import { UserHasRegistered } from '../DomainEvent/UserHasRegistered';
import { Assert } from '../../shared/Assert';
import { EventSourcedAggregateRoot } from 'ts-eventsourcing/EventSourcing/EventSourcedAggregateRoot';
import { UserHasLoggedOut } from '../DomainEvent/UserHasLoggedOut';
import { UserHasLoggedIn } from '../DomainEvent/UserHasLoggedIn';

export class UserAggregate extends EventSourcedAggregateRoot<UserId> {

  public static registerUser(id: UserId, name: string, passwordHash: string) {
    const instance = new this(id);
    Assert.assertUserName(name);
    instance.apply(new UserHasRegistered(name, passwordHash));
    return instance;
  }

  public loggedOut() {
    this.apply(new UserHasLoggedOut());
  }

  public loggedIn() {
    this.apply(new UserHasLoggedIn());
  }
}
