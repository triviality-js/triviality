import { ChannelState } from '../../shared/State/ChannelState';
import { ChatChannelId } from '../../shared/ValueObject/ChatChannelId';
import { Projector } from 'ts-eventsourcing/ReadModel/Projector';
import { ProjectorGateway } from 'eventsourcing-redux-bridge/ReadModel/ProjectorGateway';
import { StoreRepositoryInterface } from 'eventsourcing-redux-bridge/ReadModel/StoreRepositoryInterface';

export class ReduxChatProjector implements Projector {

  constructor(private readonly gateway: ProjectorGateway<ChannelState, ChatChannelId>,
              private readonly repository: StoreRepositoryInterface<ChannelState, ChatChannelId>) {
  }

}
