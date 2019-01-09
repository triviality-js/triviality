import { Container, Module } from 'triviality';
import { CommandHandler } from 'ts-eventsourcing/CommandHandling/CommandHandler';
import { EventListener } from 'ts-eventsourcing/EventHandling/EventListener';
import { EventSourcingModule } from './EventSourcingModule';
import { WebModule } from './WebModule';
import { SimpleStoreFactory } from 'eventsourcing-redux-bridge/Redux/Store/SimpleStoreFactory';
import { ReadModelAction } from 'eventsourcing-redux-bridge/ReadModel/ReadModelAction';
import { StoreRepository } from 'eventsourcing-redux-bridge/ReadModel/Repository/StoreRepository';
import { InMemoryRepository } from 'ts-eventsourcing/ReadModel/InMemoryRepository';
import { UserAggregateRepository } from './Aggregate/UserAggregateRepository';
import { UserRegisterCommandHandler } from './CommandHandler/UserRegisterCommandHandler';
import { AccountState } from '../client/Account/AcountState';
import { UserId } from '../shared/ValueObject/UserId';
import { accountReducer } from '../client/Account/accountReducer';
import { ActionWithSnapshotRepository } from 'eventsourcing-redux-bridge/ReadModel/Repository/ActionWithSnapshotRepository';
import { InMemoryActionRepository } from 'eventsourcing-redux-bridge/ReadModel/Repository/InMemoryActionRepository';
import { SocketIoGatewayFactory } from 'eventsourcing-redux-bridge/Gateway/socket.io/SocketIoGatewayFactory';
import { combineClientChain } from 'eventsourcing-redux-bridge/Gateway/ClientConnectionChain';
import { SocketConnection } from 'eventsourcing-redux-bridge/Gateway/socket.io/ValueObject/SocketConnection';
import { CommonModule } from '../shared/CommonModule';
import { QueryHandler } from 'ts-eventsourcing/QueryHandling/QueryHandler';
import { createStateQueryHandler } from './QueryHandler/StateQueryHandler';
import { QueryAccountState } from './Query/QueryAccountState';
import { AccountProjector } from './Projector/AccountProjector';
import { AccountGatewayFactory } from './Projector/Gateway/AccountGatewayFactory';
import { UserLogoutCommandHandler } from './CommandHandler/UserLogoutCommandHandler';
import { UserLoginCommandHandler } from './CommandHandler/UserLoginCommandHandler';
import { UserProjector } from './Projector/UserProjector';
import { UserModelRepository } from './ReadModel/UserModelRepository';

export class UserModule implements Module {

  constructor(private container: Container<EventSourcingModule, WebModule, CommonModule>) {
  }

  public registries() {
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

  public userGateway() {
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
    return new AccountProjector(new AccountGatewayFactory(this.userGateway()));
  }

  public userModelRepository() {
    return new UserModelRepository();
  }

  public userModelProjector() {
    return new UserProjector(this.userModelRepository());
  }
}
