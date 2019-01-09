import { Container, Module } from 'triviality';
import { CommandHandler } from 'ts-eventsourcing/CommandHandling/CommandHandler';
import { EventListener } from 'ts-eventsourcing/EventHandling/EventListener';
import { EventSourcingModule } from './EventSourcingModule';
import { WebModule } from './WebModule';
import { ChatChannelAggregateRepository } from './Aggregate/ChatChannelAggregateRepository';
import { ChatChannelCommandHandler } from './CommandHandler/ChatChannelCommandHandler';
import { SimpleStoreFactory } from 'eventsourcing-redux-bridge/Redux/Store/SimpleStoreFactory';
import { ChannelState } from '../shared/State/ChannelState';
import { ReadModelAction } from 'eventsourcing-redux-bridge/ReadModel/ReadModelAction';
import { ChatChannelId } from '../shared/ValueObject/ChatChannelId';
import { chatReducer } from '../shared/Reducer/chatReducer';
import { StoreRepositoryInterface } from 'eventsourcing-redux-bridge/ReadModel/StoreRepositoryInterface';
import { StoreRepository } from 'eventsourcing-redux-bridge/ReadModel/Repository/StoreRepository';
import { InMemoryRepository } from 'ts-eventsourcing/ReadModel/InMemoryRepository';
import { SimpleProjectorGateway } from 'eventsourcing-redux-bridge/ReadModel/Projector/SimpleProjectorGateway';
import { ReduxChatProjector } from './Projector/ReduxChatProjector';

export class ChatChannelModule implements Module {

  constructor(private container: Container<EventSourcingModule, WebModule>) {
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
