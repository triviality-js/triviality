import { Container, Feature, OptionalRegistries } from '@triviality/core';
import { EventsourcingReduxServerFeature } from '@triviality/eventsourcing-redux/EventsourcingReduxServerFeature';
import { combineClientChain } from '@triviality/eventsourcing-redux/Gateway/ClientConnectionChain';
import { SocketIoGatewayFactory } from '@triviality/eventsourcing-redux/Gateway/socket.io/SocketIoGatewayFactory';
import { SocketConnection } from '@triviality/eventsourcing-redux/Gateway/socket.io/ValueObject/SocketConnection';
import { createStateQueryHandler } from '@triviality/eventsourcing-redux/QueryHandling/createStateQueryHandler';
import { ReadModelAction } from '@triviality/eventsourcing-redux/ReadModel/ReadModelAction';
import { ActionWithSnapshotRepository } from '@triviality/eventsourcing-redux/ReadModel/Repository/ActionWithSnapshotRepository';
import { InMemoryActionRepository } from '@triviality/eventsourcing-redux/ReadModel/Repository/InMemoryActionRepository';
import { StoreRepository } from '@triviality/eventsourcing-redux/ReadModel/Repository/StoreRepository';
import { SimpleStoreFactory } from '@triviality/eventsourcing-redux/Redux/Store/SimpleStoreFactory';
import { CommandHandler } from '@triviality/eventsourcing/CommandHandling/CommandHandler';
import { EventListener } from '@triviality/eventsourcing/EventHandling/EventListener';
import { EventSourcingFeature } from '@triviality/eventsourcing/EventSourcingFeature';
import { QueryHandler } from '@triviality/eventsourcing/QueryHandling/QueryHandler';
import { InMemoryRepository } from '@triviality/eventsourcing/ReadModel/InMemoryRepository';
import { SerializerFeature } from '@triviality/serializer';
import { accountReducer } from '../client/Account/accountReducer';
import { AccountState } from '../client/Account/AcountState';
import { UserId } from '../shared/ValueObject/UserId';
import { UserAggregateRepository } from './Aggregate/UserAggregateRepository';
import { UserLoginCommandHandler } from './CommandHandler/UserLoginCommandHandler';
import { UserLogoutCommandHandler } from './CommandHandler/UserLogoutCommandHandler';
import { UserRegisterCommandHandler } from './CommandHandler/UserRegisterCommandHandler';
import { AccountProjector } from './Projector/AccountProjector';
import { AccountGatewayFactory } from './Projector/Gateway/AccountGatewayFactory';
import { UserProjector } from './Projector/UserProjector';
import { QueryAccountState } from './Query/QueryAccountState';
import { UserModelRepository } from './ReadModel/UserModelRepository';
import { WebFeature } from './WebFeature';

export class UserFeature implements Feature {

  constructor(private container: Container<EventSourcingFeature, EventsourcingReduxServerFeature, WebFeature, SerializerFeature>) {
  }

  public registries(): OptionalRegistries<EventSourcingFeature> {
    return {
      commandHandlers: (): CommandHandler[] => {
        return [
          new UserRegisterCommandHandler(this.userRepository(), this.userModelRepository()),
          new UserLogoutCommandHandler(this.userRepository()),
          new UserLoginCommandHandler(this.userRepository(), this.userModelRepository()),
        ];
      },
      queryHandlers: (): QueryHandler[] => {
        return [
          this.userStateQueryHandler(),
        ];
      },
      eventListeners: (): EventListener[] => {
        return [
          this.userModelProjector(),
          this.userReduxProjector(),
        ];
      },
    };
  }

  public userStateQueryHandler(): QueryHandler {
    return createStateQueryHandler<QueryAccountState, AccountState, UserId>(
      this.userReduxReadModelRepository(),
      QueryAccountState,
    );
  }

  public userRepository(): UserAggregateRepository {
    return new UserAggregateRepository(
      this.container.eventStore(),
      this.container.domainEventBus(),
      this.container.domainEventStreamDecorator(),
    );
  }

  public userReduxReadModelRepository() {
    const accountStoreFactory = new SimpleStoreFactory<AccountState, ReadModelAction<UserId>>(accountReducer);
    return new ActionWithSnapshotRepository<AccountState, UserId>(
      new InMemoryActionRepository(accountStoreFactory) as any,
      new StoreRepository<AccountState, UserId>(
        new InMemoryRepository(),
        accountStoreFactory,
      ),
    );

  }

  public userGatewayFactory() {
    return new SocketIoGatewayFactory<AccountState, UserId>(
      this.container.socketServer(),
      this.container.serializer(),
      this.userReduxReadModelRepository(),
      combineClientChain(
        (next) => (connection: SocketConnection) => {
          if (connection) {
            // connection.client.handshake.
            // throw new Error('No permission');
          }
          next(connection);
        },
      ),
    );
  }

  public userReduxProjector() {
    return new AccountProjector(new AccountGatewayFactory(this.userGatewayFactory()));
  }

  public userModelRepository() {
    return new UserModelRepository();
  }

  public userModelProjector() {
    return new UserProjector(this.userModelRepository());
  }
}
