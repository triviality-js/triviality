import { DomainMessage } from '@triviality/eventsourcing/Domain/DomainMessage';
import { HandleDomainEvent } from '@triviality/eventsourcing/EventHandling/HandleDomainEvent';
import { Projector } from '@triviality/eventsourcing/ReadModel/Projector';
import { UserId } from '../../shared/ValueObject/UserId';
import { UserHasRegistered } from '../DomainEvent/UserHasRegistered';
import { UserModel } from '../ReadModel/UserModel';
import { UserModelRepository } from '../ReadModel/UserModelRepository';

export class UserProjector implements Projector {

  constructor(private readonly repository: UserModelRepository) {

  }

  @HandleDomainEvent
  public async handleUserHasRegistered(event: UserHasRegistered, message: DomainMessage<UserHasRegistered, UserId>) {
    return this.repository.save(new UserModel(message.aggregateId, event.name, event.passwordHash));
  }

}
