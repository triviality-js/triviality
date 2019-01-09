import { UserHasRegistered } from '../DomainEvent/UserHasRegistered';
import { Projector } from 'ts-eventsourcing/ReadModel/Projector';
import { HandleDomainEvent } from 'ts-eventsourcing/EventHandling/HandleDomainEvent';
import { DomainMessage } from 'ts-eventsourcing/Domain/DomainMessage';
import { UserId } from '../../shared/ValueObject/UserId';
import { AccountGatewayFactory } from './Gateway/AccountGatewayFactory';
import { actionForDomainMessage } from 'eventsourcing-redux-bridge/ReadModel/actions';

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
