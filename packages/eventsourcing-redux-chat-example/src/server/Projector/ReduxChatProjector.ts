import { ChannelState } from '../../shared/State/ChannelState';
import { ChatChannelId } from '../../shared/ValueObject/ChatChannelId';
import { Projector } from 'ts-eventsourcing/ReadModel/Projector';
import { StoreRepositoryInterface } from 'eventsourcing-redux-bridge/ReadModel/StoreRepositoryInterface';
import { ProjectorGatewayInterface } from 'eventsourcing-redux-bridge/ReadModel/ProjectorGatewayInterface';
import { UserHasRegistered } from '../DomainEvent/UserHasRegistered';
import { UserId } from '../../shared/ValueObject/UserId';
import { DomainMessage } from 'ts-eventsourcing/Domain/DomainMessage';
import { HandleDomainEvent } from 'ts-eventsourcing/EventHandling/HandleDomainEvent';

export class ReduxChatProjector implements Projector {

  constructor(readonly gateway: ProjectorGatewayInterface<ChatChannelId>,
              readonly repository: StoreRepositoryInterface<ChannelState, ChatChannelId>) {
  }

  @HandleDomainEvent
  public async handleUserHasRegistered(_event: UserHasRegistered, _message: DomainMessage<UserHasRegistered, UserId>) {
  }

}
