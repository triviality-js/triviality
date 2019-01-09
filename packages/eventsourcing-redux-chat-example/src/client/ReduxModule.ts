import { Container, Module } from 'triviality';
import { SimpleStoreFactory } from 'eventsourcing-redux-bridge/Redux/Store/SimpleStoreFactory';
import { AnyAction, applyMiddleware, combineReducers, Store } from 'redux';
import { appReducer } from './App/appReducer';
import { accountReducer } from './Account/accountReducer';
import { StoreState } from './StoreState';
import { composeWithDevTools } from 'redux-devtools-extension';
import { ChannelState } from '../shared/State/ChannelState';
import { gatewayMiddleway } from 'eventsourcing-redux-bridge/Gateway/Middleware/gatewayMiddleware';
import { commandHandlerResponseMiddleware } from 'eventsourcing-redux-bridge/CommandHandling/Middleware/commandHandlerResponseMiddleware';
import { queryHandlerResponseMiddleware } from 'eventsourcing-redux-bridge/QueryHandling/Middleware/queryHandlerResponseMiddleware';
import { queryMiddleware } from 'eventsourcing-redux-bridge/QueryHandling/Middleware/queryMiddleware';
import { commandMiddleware } from 'eventsourcing-redux-bridge/CommandHandling/Middleware/commandMiddleware';
import { accountMiddleware } from './Account/accountMiddleware';
import { PersistentStoreFactory } from '../server/PersistentStoreFactory';
import { KeyValueStore } from '../server/KeyValueStore';
import { CommonModule } from '../shared/CommonModule';
import { ValueStore } from '../server/ValueStore';
import * as socketIo from 'socket.io-client';
import { ClientSocketIOGateway } from 'eventsourcing-redux-bridge/Gateway/socket.io/ClientSocketIOGateway';
import { ValueStoreInterface } from '../server/ValueStoreInterface';
import * as _ from 'lodash';

export class ReduxModule implements Module {

  constructor(private container: Container<CommonModule>) {
  }

  public valueStore(): ValueStoreInterface<StoreState> {
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

  public appStoreFactory() {
    const storeFactory = new SimpleStoreFactory(combineReducers({
      app: appReducer,
      account: accountReducer,
    }));
    return new PersistentStoreFactory(storeFactory, this.valueStore());
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

  public store(): Store<StoreState, AnyAction> {
    const composeEnhancers = composeWithDevTools({
      actionsBlacklist: [],
      // Specify name here, actionsBlacklist, actionsCreators and other options if needed
    });
    const gateway = this.gatewayFactory()('/chat');
    return this.appStoreFactory().create(composeEnhancers(applyMiddleware<ChannelState>(
      gatewayMiddleway(this.gatewayFactory()),
      commandHandlerResponseMiddleware(),
      queryHandlerResponseMiddleware(),
      queryMiddleware(gateway),
      commandMiddleware(gateway),
      accountMiddleware(),
    ))) as any;
  }
}
