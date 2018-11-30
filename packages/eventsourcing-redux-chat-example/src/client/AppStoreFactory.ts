import { AnyAction, applyMiddleware, combineReducers, Store } from 'redux';
import { SimpleStoreFactory } from 'eventsourcing-redux-bridge/Redux/Store/SimpleStoreFactory';
import { accountReducer } from './Account/accountReducer';
import { ChannelState } from '../shared/State/ChannelState';
import { AppState } from './AppState';
import { ClientGatewayInterface } from 'eventsourcing-redux-bridge/Gateway/ClientGatewayInterface';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Metadata } from 'ts-eventsourcing/Metadata';
import { accountMiddleware } from './Account/accountMiddleware';
import { commandMiddleware } from 'eventsourcing-redux-bridge/CommandHandling/Middleware/commandMiddleware';
import { commandHandlerResponseMiddleware } from 'eventsourcing-redux-bridge/CommandHandling/Middleware/commandHandlerResponseMiddleware';
import { gatewayMiddleway } from 'eventsourcing-redux-bridge/Gateway/Middleware/gatewayMiddleware';
import { queryHandlerResponseMiddleware } from 'eventsourcing-redux-bridge/QueryHandling/Middleware/queryHandlerResponseMiddleware';
import { queryMiddleware } from 'eventsourcing-redux-bridge/QueryHandling/Middleware/queryMiddleware';

export class AppStoreFactory {
  private factory = new SimpleStoreFactory(combineReducers({
    account: accountReducer,
  }));

  public createForClient(gatewayFactory: (gate: string, metadata?: Metadata) => ClientGatewayInterface): Store<AppState, AnyAction> {
    const composeEnhancers = composeWithDevTools({
      // Specify name here, actionsBlacklist, actionsCreators and other options if needed
    });
    const gateway = gatewayFactory('/chat');
    return this.factory.create(composeEnhancers(applyMiddleware<ChannelState>(
      gatewayMiddleway(gatewayFactory),
      commandHandlerResponseMiddleware(),
      queryHandlerResponseMiddleware(),
      queryMiddleware(gateway),
      commandMiddleware(gateway),
      accountMiddleware(),
    ))) as any;
  }

  public createForServer(): Store<AppState, AnyAction> {
    return this.factory.create(applyMiddleware<ChannelState>()) as any;
  }
}
