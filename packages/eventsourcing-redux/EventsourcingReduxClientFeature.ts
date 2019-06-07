import { Container, Feature, Optional, OptionalRegistries } from '@triviality/core';
import { LoggerFeature } from '@triviality/logger';
import { ReduxFeature } from '@triviality/redux';
import { SerializerFeature } from '@triviality/serializer';
import { Action, ReducersMapObject } from 'redux';
import { Epic } from 'redux-observable';
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

export class EventsourcingReduxClientFeature<S = {}, A extends Action<any> = Action<any>> implements Feature {

  constructor(private container: Container<LoggerFeature, SerializerFeature, ReduxFeature<S, A>>) {
  }

  public registries(): OptionalRegistries<ReduxFeature<S, A>> {
    return {
      middleware: () => {
        return [
          commandHandlerResponseMiddleware(),
          queryHandlerResponseMiddleware(),
          queryMiddleware(this.defaultGateway()),
          commandMiddleware(this.defaultGateway()),
        ];
      },
      epics: (): Array<Epic<A, A, S>> => [
        gatewayEpic((gate: string, metadata) => this.gatewayRegistry().get(gate, metadata).listen()),
      ],
      reducers: (): Optional<ReducersMapObject<S, A>> => {
        return {
          gateway: gatewayReducer(this.defaultGatewayOption().gate),
        } as any;
      },
    };
  }

  public setup() {
    const { setup } = this.defaultGatewayOption();
    if (setup) {
      this.openCQSGateway()();
    }
  }

  public openCQSGateway() {
    return () => {
      const { gate, entity } = this.defaultGatewayOption();
      this.container.store().dispatch(gatewayOpen(entity, gate));
    };
  }

  public gatewayRegistry(): GatewayRegistry<any> {
    return new SocketIOGatewayRegistry(this.container.serializer());
  }

  public defaultGateway(): ClientGatewayInterface {
    const { gate, entity } = this.defaultGatewayOption();
    return this.gatewayRegistry().get(gate, { entity });
  }

  public defaultGatewayOption(): { entity: EntityName, gate: any, setup: boolean } {
    return {
      entity: 'cqs',
      gate: '/cqs',
      setup: true,
    };
  }
}
