import { FF } from '@triviality/core';
import { EventsourcingReduxServerFeatureServices } from '@triviality/eventsourcing-redux/EventsourcingReduxServerFeature';
import { combineClientChain } from '@triviality/eventsourcing-redux/Gateway/ClientConnectionChain';
import { SocketIoGatewayFactory } from '@triviality/eventsourcing-redux/Gateway/socket.io/SocketIoGatewayFactory';
import { SocketConnection } from '@triviality/eventsourcing-redux/Gateway/socket.io/ValueObject/SocketConnection';
import { createStateQueryHandler } from '@triviality/eventsourcing-redux/QueryHandling/createStateQueryHandler';
import { ReadModelAction } from '@triviality/eventsourcing-redux/ReadModel/ReadModelAction';
import { ActionWithSnapshotRepository } from '@triviality/eventsourcing-redux/ReadModel/Repository/ActionWithSnapshotRepository';
import { InMemoryActionRepository } from '@triviality/eventsourcing-redux/ReadModel/Repository/InMemoryActionRepository';
import { StoreRepository } from '@triviality/eventsourcing-redux/ReadModel/Repository/StoreRepository';
import { SimpleStoreFactory } from '@triviality/eventsourcing-redux/Redux/Store/SimpleStoreFactory';
import { EventSourcingFeatureServices } from '@triviality/eventsourcing/EventSourcingFeature';
import { QueryHandler } from '@triviality/eventsourcing/QueryHandling/QueryHandler';
import { InMemoryRepository } from '@triviality/eventsourcing/ReadModel/InMemoryRepository';
import { SerializerFeatureServices } from '@triviality/serializer';
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
import { ActionRepositoryInterface } from '@triviality/eventsourcing-redux/ReadModel/ActionRepositoryInterface';
import { ProjectorGatewayFactory } from '@triviality/eventsourcing-redux/Gateway/Projector/ProjectorGatewayFactory';
import { SocketIoGatewayOptions } from '@triviality/eventsourcing-redux/Gateway/socket.io/SocketIoGatewayOptions';

export interface UserFeatureServices {
  userStateQueryHandler: QueryHandler;
  userRepository: UserAggregateRepository;
  userReduxReadModelRepository: ActionRepositoryInterface<AccountState, UserId>;
  userGatewayFactory: ProjectorGatewayFactory<SocketIoGatewayOptions>;
  userReduxProjector: AccountProjector;
  userModelRepository: UserModelRepository;
  userModelProjector: UserProjector;
}

type UserFeatureDependencies =
  EventSourcingFeatureServices
  & EventsourcingReduxServerFeatureServices
  & WebFeature
  & SerializerFeatureServices;

export const UserFeature: FF<UserFeatureServices, UserFeatureDependencies> =
  ({
     socketServer,
     serializer,
     construct,
     registers: {
       commandHandlers,
       queryHandlers,
       eventListeners,
     },
   }) => {

    commandHandlers(construct(UserRegisterCommandHandler, 'userRepository', 'userModelRepository'));
    commandHandlers(construct(UserLogoutCommandHandler, 'userRepository'));
    commandHandlers(construct(UserLoginCommandHandler, 'userRepository', 'userModelRepository'));

    queryHandlers('userStateQueryHandler');

    eventListeners('userModelProjector');

    eventListeners('userReduxProjector');

    return {
      userStateQueryHandler(): QueryHandler {
        return createStateQueryHandler<QueryAccountState, AccountState, UserId>(
          this.userReduxReadModelRepository(),
          QueryAccountState,
        );
      },

      userRepository: construct(UserAggregateRepository, 'eventStore', 'domainEventBus', 'domainEventStreamDecorator'),
      userReduxReadModelRepository() {
        const accountStoreFactory = new SimpleStoreFactory<AccountState, ReadModelAction<UserId>>(accountReducer);
        return new ActionWithSnapshotRepository<AccountState, UserId>(
          new InMemoryActionRepository(accountStoreFactory) as any,
          new StoreRepository<AccountState, UserId>(
            new InMemoryRepository(),
            accountStoreFactory,
          ),
        );

      },
      userGatewayFactory() {
        return new SocketIoGatewayFactory<AccountState, UserId>(
          socketServer(),
          serializer(),
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
      },

      userReduxProjector() {
        return new AccountProjector(new AccountGatewayFactory(this.userGatewayFactory()));
      },
      userModelRepository() {
        return new UserModelRepository();
      },
      userModelProjector() {
        return new UserProjector(this.userModelRepository());
      },
    };
  };
