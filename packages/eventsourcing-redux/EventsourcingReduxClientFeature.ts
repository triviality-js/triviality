import { FF, SetupFeatureServices } from '@triviality/core';
import { LoggerFeatureServices } from '@triviality/logger';
import { SerializerFeatureServices } from '@triviality/serializer';
import { Action, AnyAction } from 'redux';
import { commandHandlerResponseMiddleware } from './CommandHandling/Middleware/commandHandlerResponseMiddleware';
import { commandMiddleware } from './CommandHandling/Middleware/commandMiddleware';
import { gatewayOpen } from './Gateway/actions';
import { ClientGatewayInterface } from './Gateway/ClientGatewayInterface';
import { gatewayEpic } from './Gateway/Epic/gatewayEpic';
import { GatewayRegistry } from './Gateway/GatewayRegistry';
import { gatewayReducer } from './Gateway/Reducer/gatewayReducer';
import { SocketIOGatewayRegistry } from './Gateway/socket.io/SocketIOGatewayRegistry';
import { queryHandlerResponseMiddleware } from './QueryHandling/Middleware/queryHandlerResponseMiddleware';
import { queryMiddleware } from './QueryHandling/Middleware/queryMiddleware';
import { EntityName } from './ValueObject/EntityName';
import { ReduxFeatureServices } from '@triviality/redux/ReduxFeature';

export interface EventsourcingReduxClientFeatureServices {
  openCQSGateway: () => void;

  gatewayRegistry: GatewayRegistry<any>;

  defaultGateway: ClientGatewayInterface;

  defaultGatewayOption: { entity: EntityName, gate: any, setup: boolean };
}

export interface EventsourcingReduxClientFeatureDependencies<S = any, A extends Action = AnyAction, D = {}> extends SetupFeatureServices, LoggerFeatureServices, SerializerFeatureServices, ReduxFeatureServices<S, A, D> {

}

export const EventsourcingReduxClientFeature = <S = {}, A extends Action<any> = Action<any>>(): FF<EventsourcingReduxClientFeatureServices, EventsourcingReduxClientFeatureDependencies<S, A>> =>
  ({
     store, serializer,
     instance,
     registers: {
       setupCallbacks,
       middleware,
       epics,
       reducers,
     },
   }) => {

    setupCallbacks('openCQSGateway');

    middleware(
      () => commandHandlerResponseMiddleware(),
      () => queryHandlerResponseMiddleware(),
      () => queryMiddleware(instance('defaultGateway')),
      () => commandMiddleware(instance('defaultGateway')),
    );

    epics(
      () => gatewayEpic((gate: string, metadata) => instance('gatewayRegistry').get(gate, metadata).listen()),
    );

    reducers(
      ['gateway', () => gatewayReducer(instance('defaultGatewayOption').gate)],
    );

    return {
      openCQSGateway() {
        return () => {
          const { gate, entity } = this.defaultGatewayOption();
          store().dispatch(gatewayOpen(entity, gate) as any);
        };
      },

      gatewayRegistry(): GatewayRegistry<any> {
        return new SocketIOGatewayRegistry(serializer());
      },

      defaultGateway(): ClientGatewayInterface {
        const { gate, entity } = this.defaultGatewayOption();
        return this.gatewayRegistry().get(gate, { entity });
      },

      defaultGatewayOption(): { entity: EntityName, gate: any, setup: boolean } {
        return {
          entity: 'cqs',
          gate: '/cqs',
          setup: true,
        };
      },
    };
  };
