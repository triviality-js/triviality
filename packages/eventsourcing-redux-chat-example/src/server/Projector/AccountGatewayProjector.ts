import { UserHasRegistered } from '../DomainEvent/UserHasRegistered';
import { ChatChannelId } from '../../shared/ValueObject/ChatChannelId';
import { Projector } from 'ts-eventsourcing/ReadModel/Projector';
import { HandleDomainEvent } from 'ts-eventsourcing/EventHandling/HandleDomainEvent';
import { DomainMessage } from 'ts-eventsourcing/Domain/DomainMessage';
import { StoreRepositoryInterface } from 'eventsourcing-redux-bridge/ReadModel/StoreRepositoryInterface';
import { AccountState } from '../../client/Account/AcountState';
import { UserId } from '../../shared/ValueObject/UserId';
import { ProjectorGatewayFactory } from '../SocketIoGatewayFactory';

export class AccountGatewayProjector implements Projector {

  constructor(private readonly repository: StoreRepositoryInterface<AccountState, UserId>,
              private readonly gateway: ProjectorGatewayFactory<string, AccountState, UserId>) {


  }

  @HandleDomainEvent
  public async handleUserHasRegistered(_event: UserHasRegistered, message: DomainMessage<UserHasRegistered, ChatChannelId>) {
    const aggregate = await this.repository.create(message.aggregateId);
    const gateway = this.gateway.open('/account/' + message.aggregateId.toString());
    await gateway.dispatchAndSaveMessage(aggregate, message);
  }

}
