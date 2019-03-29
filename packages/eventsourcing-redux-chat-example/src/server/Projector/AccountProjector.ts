import { actionForDomainMessage } from '@triviality/eventsourcing-redux/ReadModel/actions';
import { DomainMessage } from '@triviality/eventsourcing/Domain/DomainMessage';
import { HandleDomainEvent } from '@triviality/eventsourcing/EventHandling/HandleDomainEvent';
import { Projector } from '@triviality/eventsourcing/ReadModel/Projector';
import { UserId } from '../../shared/ValueObject/UserId';
import { UserHasRegistered } from '../DomainEvent/UserHasRegistered';
import { AccountGatewayFactory } from './Gateway/AccountGatewayFactory';

export class AccountProjector implements Projector {

  constructor(private readonly accountGateWay: AccountGatewayFactory) {

  }

  @HandleDomainEvent
  public async handleUserHasRegistered(_event: UserHasRegistered, message: DomainMessage<UserHasRegistered, UserId>) {
    const id = message.aggregateId;
    const gateway = this.accountGateWay.open(id);
    await gateway.dispatchActionAndSave(id, actionForDomainMessage(id, message, 'Account'));
  }

}
