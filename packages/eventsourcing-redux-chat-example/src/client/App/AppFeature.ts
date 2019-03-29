import { Container, Feature, OptionalRegistries } from '@triviality/core';
import { commandHandlerResponseMiddleware } from '@triviality/eventsourcing-redux/CommandHandling/Middleware/commandHandlerResponseMiddleware';
import { commandMiddleware } from '@triviality/eventsourcing-redux/CommandHandling/Middleware/commandMiddleware';
import { gatewayOpen } from '@triviality/eventsourcing-redux/Gateway/actions';
import { gatewayMiddleway } from '@triviality/eventsourcing-redux/Gateway/Middleware/gatewayMiddleware';
import { ClientSocketIOGateway } from '@triviality/eventsourcing-redux/Gateway/socket.io/ClientSocketIOGateway';
import { queryHandlerResponseMiddleware } from '@triviality/eventsourcing-redux/QueryHandling/Middleware/queryHandlerResponseMiddleware';
import { queryMiddleware } from '@triviality/eventsourcing-redux/QueryHandling/Middleware/queryMiddleware';
import { LoggerFeature } from '@triviality/logger';
import { SerializerFeature } from '@triviality/serializer';
import * as _ from 'lodash';
import * as socketIo from 'socket.io-client';
import { KeyValueStore } from '../../server/KeyValueStore';
import { persistentStateEnhancer } from '../../server/persistentStateEnhancer';
import { StateStorageInterface } from '../../server/StateStorageInterface';
import { ValueStore } from '../../server/ValueStore';
import { ChatReduxFeature } from '../ChatReduxFeature';
import { StoreState } from '../StoreState';
import { appReducer } from './appReducer';

export class AppFeature implements Feature {

  constructor(private container: Container<LoggerFeature, SerializerFeature, ChatReduxFeature>) {
  }

  public registries(): OptionalRegistries<ChatReduxFeature> {
    return {
      reducers: () => {
        return {
          app: appReducer,
        };
      },
      enhancers: () => {
        return [this.persistentStoreEnhancer()];
      },
      middleware: () => {
        return [
          gatewayMiddleway(this.gatewayFactory()),
          commandHandlerResponseMiddleware(),
          queryHandlerResponseMiddleware(),
          queryMiddleware(this.gateway()),
          commandMiddleware(this.gateway()),
        ];
      },
    };
  }

  public setup() {
    this.container.store().dispatch(gatewayOpen('app', '/chat'));
  }

  public valueStore(): StateStorageInterface<StoreState> {
    const store = new ValueStore<any>(new KeyValueStore(this.container.serializer()), 'chat-state');
    const logger = this.container.logger();
    return {
      set(value: StoreState): void {
        const picked = _.pick(value, ['account']);
        try {
          return store.set(picked);
        } catch (e) {
          logger.error(e);
        }
      },
      get(): StoreState | null {
        try {
          return store.get();
        } catch (e) {
          logger.error(e);
          return null;
        }
      },
    };
  }

  public persistentStoreEnhancer() {
    return persistentStateEnhancer(this.valueStore());
  }

  public gatewayFactory() {
    const sockets: { [name: string]: ClientSocketIOGateway } = {};
    return (path: string) => {
      if (sockets[path]) {
        return sockets[path];
      }
      const socket = socketIo.connect(`http://localhost:3000${path}`);
      sockets[path] = new ClientSocketIOGateway(socket, this.container.serializer());
      return sockets[path];
    };
  }

  public gateway() {
    return this.gatewayFactory()('/chat');
  }
}
