import { ProjectorGatewayInterface } from '@triviality/eventsourcing-redux/ReadModel/ProjectorGatewayInterface';
import { StoreRepositoryInterface } from '@triviality/eventsourcing-redux/ReadModel/StoreRepositoryInterface';
import { DomainMessage } from '@triviality/eventsourcing/Domain/DomainMessage';
import { HandleDomainEvent } from '@triviality/eventsourcing/EventHandling/HandleDomainEvent';
import { Projector } from '@triviality/eventsourcing/ReadModel/Projector';
import { ChannelState } from '../../shared/State/ChannelState';
import { ChatChannelId } from '../../shared/ValueObject/ChatChannelId';
import { UserId } from '../../shared/ValueObject/UserId';
import { UserHasRegistered } from '../DomainEvent/UserHasRegistered';

export class ReduxChatProjector implements Projector {

  constructor(readonly gateway: ProjectorGatewayInterface<ChatChannelId>,
              readonly repository: StoreRepositoryInterface<ChannelState, ChatChannelId>) {
  }

  @HandleDomainEvent
  public async handleUserHasRegistered(_event: UserHasRegistered, _message: DomainMessage<UserHasRegistered, UserId>) {
    // Noop.
  }

}
