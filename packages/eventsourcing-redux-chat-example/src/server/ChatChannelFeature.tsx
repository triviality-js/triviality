import { Container, Feature } from '@triviality/core';
import { SimpleProjectorGateway } from '@triviality/eventsourcing-redux/ReadModel/Projector/SimpleProjectorGateway';
import { ReadModelAction } from '@triviality/eventsourcing-redux/ReadModel/ReadModelAction';
import { StoreRepository } from '@triviality/eventsourcing-redux/ReadModel/Repository/StoreRepository';
import { StoreRepositoryInterface } from '@triviality/eventsourcing-redux/ReadModel/StoreRepositoryInterface';
import { SimpleStoreFactory } from '@triviality/eventsourcing-redux/Redux/Store/SimpleStoreFactory';
import { CommandHandler } from '@triviality/eventsourcing/CommandHandling/CommandHandler';
import { EventListener } from '@triviality/eventsourcing/EventHandling/EventListener';
import { InMemoryRepository } from '@triviality/eventsourcing/ReadModel/InMemoryRepository';
import { chatReducer } from '../shared/Reducer/chatReducer';
import { ChannelState } from '../shared/State/ChannelState';
import { ChatChannelId } from '../shared/ValueObject/ChatChannelId';
import { ChatChannelAggregateRepository } from './Aggregate/ChatChannelAggregateRepository';
import { ChatChannelCommandHandler } from './CommandHandler/ChatChannelCommandHandler';
import { EventSourcingFeature } from './EventSourcingFeature';
import { ReduxChatProjector } from './Projector/ReduxChatProjector';
import { WebFeature } from './WebFeature';

export class ChatChannelFeature implements Feature {

  constructor(private container: Container<EventSourcingFeature, WebFeature>) {
  }

  public registries() {
    return {
      commandHandlers: (): CommandHandler[] => {
        return [
          new ChatChannelCommandHandler(this.chatChannelRepository()),
        ];
      },
      eventListeners: (): EventListener[] => {
        return [
          this.chatProjector(),
        ];
      },
    };
  }

  public chatChannelRepository(): ChatChannelAggregateRepository {
    return new ChatChannelAggregateRepository(
      this.container.eventStore(),
      this.container.domainEventBus(),
    );
  }

  public chatChannelStoreReadModelRepository(): StoreRepositoryInterface<ChannelState, ChatChannelId> {
    const storeFactory = new SimpleStoreFactory<ChannelState, ReadModelAction<ChatChannelId>>(chatReducer);
    return new StoreRepository(new InMemoryRepository(), storeFactory) as any;
  }

  public chatGateway() {
    return new SimpleProjectorGateway<ChannelState, ChatChannelId>(
      this.chatChannelStoreReadModelRepository(),
      this.container.serverGateway(),
    );
  }

  public chatProjector() {
    return new ReduxChatProjector(
      this.chatGateway(),
      this.chatChannelStoreReadModelRepository(),
    );
  }

}
