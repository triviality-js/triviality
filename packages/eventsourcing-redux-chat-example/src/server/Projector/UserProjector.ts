import { UserHasRegistered } from '../DomainEvent/UserHasRegistered';
import { Projector } from 'ts-eventsourcing/ReadModel/Projector';
import { HandleDomainEvent } from 'ts-eventsourcing/EventHandling/HandleDomainEvent';
import { UserModelRepository } from '../ReadModel/UserModelRepository';
import { UserModel } from '../ReadModel/UserModel';
import { DomainMessage } from 'ts-eventsourcing/Domain/DomainMessage';
import { UserId } from '../../shared/ValueObject/UserId';

export class UserProjector implements Projector {

  constructor(private readonly repository: UserModelRepository) {

  }

  @HandleDomainEvent
  public async handleUserHasRegistered(event: UserHasRegistered, message: DomainMessage<UserHasRegistered, UserId>) {
    return this.repository.save(new UserModel(message.aggregateId, event.name, event.passwordHash));
  }

}
