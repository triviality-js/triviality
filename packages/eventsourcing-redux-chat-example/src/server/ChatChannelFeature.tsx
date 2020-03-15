import { FF } from '@triviality/core';
import { SimpleProjectorGateway } from '@triviality/eventsourcing-redux/ReadModel/Projector/SimpleProjectorGateway';
import { ReadModelAction } from '@triviality/eventsourcing-redux/ReadModel/ReadModelAction';
import { StoreRepository } from '@triviality/eventsourcing-redux/ReadModel/Repository/StoreRepository';
import { StoreRepositoryInterface } from '@triviality/eventsourcing-redux/ReadModel/StoreRepositoryInterface';
import { SimpleStoreFactory } from '@triviality/eventsourcing-redux/Redux/Store/SimpleStoreFactory';
import { EventSourcingFeatureServices } from '@triviality/eventsourcing/EventSourcingFeature';
import { InMemoryRepository } from '@triviality/eventsourcing/ReadModel/InMemoryRepository';
import { chatReducer } from '../shared/Reducer/chatReducer';
import { ChannelState } from '../shared/State/ChannelState';
import { ChatChannelId } from '../shared/ValueObject/ChatChannelId';
import { ChatChannelAggregateRepository } from './Aggregate/ChatChannelAggregateRepository';
import { ChatChannelCommandHandler } from './CommandHandler/ChatChannelCommandHandler';
import { ReduxChatProjector } from './Projector/ReduxChatProjector';
import { ServerSocketIOGateway } from '@triviality/eventsourcing-redux/Gateway/socket.io/ServerSocketIOGateway';

export interface ChatChannelFeatureServices {
  chatChannelRepository: ChatChannelAggregateRepository;

  chatChannelStoreReadModelRepository: StoreRepositoryInterface<ChannelState, ChatChannelId>;

  chatGateway: SimpleProjectorGateway<ChannelState, ChatChannelId>;

  chatProjector: ReduxChatProjector;
}

export interface ChatChannelFeatureDependencies extends EventSourcingFeatureServices {
  serverGateway: ServerSocketIOGateway;
}

export const ChatChannelFeature: FF<ChatChannelFeatureServices, ChatChannelFeatureDependencies> =
  ({
     construct, serverGateway, registers: {
      commandHandlers,
      eventListeners,
    },
   }) => {

    return {

      ...commandHandlers(construct(ChatChannelCommandHandler, 'chatChannelRepository')),
      ...eventListeners('chatProjector'),
      chatChannelRepository: construct(
        ChatChannelAggregateRepository, 'eventStore', 'domainEventBus', 'domainEventStreamDecorator'),
      chatChannelStoreReadModelRepository(): StoreRepositoryInterface<ChannelState, ChatChannelId> {
        const storeFactory = new SimpleStoreFactory<ChannelState, ReadModelAction<ChatChannelId>>(chatReducer);
        return new StoreRepository(new InMemoryRepository(), storeFactory) as any;
      },

      chatGateway() {
        return new SimpleProjectorGateway<ChannelState, ChatChannelId>(
          this.chatChannelStoreReadModelRepository(),
          serverGateway(),
        );
      },

      chatProjector() {
        return new ReduxChatProjector(
          this.chatGateway(),
          this.chatChannelStoreReadModelRepository(),
        );
      },
    };
  };
