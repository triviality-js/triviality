import { EventSourcedAggregateRoot } from '@triviality/eventsourcing/EventSourcing/EventSourcedAggregateRoot';
import { Assert } from '../../shared/Assert';
import { UserId } from '../../shared/ValueObject/UserId';
import { UserHasLoggedIn } from '../DomainEvent/UserHasLoggedIn';
import { UserHasLoggedOut } from '../DomainEvent/UserHasLoggedOut';
import { UserHasRegistered } from '../DomainEvent/UserHasRegistered';

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
