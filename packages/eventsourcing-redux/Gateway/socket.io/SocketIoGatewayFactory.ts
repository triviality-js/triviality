import { Namespace, Server, Socket } from 'socket.io';
import { Identity } from '@triviality/eventsourcing/ValueObject/Identity';
import { ServerSocketIOGateway } from './ServerSocketIOGateway';
import { SerializerInterface } from '@triviality/serializer';
import { StoreRepositoryInterface } from '../../ReadModel/StoreRepositoryInterface';
import { SimpleProjectorGateway } from '../../ReadModel/Projector/SimpleProjectorGateway';
import { ReadModelAction, ReadModelMetadata } from '../../ReadModel/ReadModelAction';
import { ProjectorGatewayFactory } from '../Projector/ProjectorGatewayFactory';
import { ProjectorGatewayInterface } from '../../ReadModel/ProjectorGatewayInterface';
import { SocketConnection } from './ValueObject/SocketConnection';
import { SocketIoGatewayFactoryError } from './Error/SocketIoGatewayFactoryError';

export interface SocketIoGatewayOptions {
  nsp: string;
}

/**
 * Namespace based gateway factory for projectors.
 */
export class SocketIoGatewayFactory<
  State,
  Id extends Identity = Identity,
  Metadata extends ReadModelMetadata<Id> = ReadModelMetadata<Id>,
  Action extends ReadModelAction<Id, Metadata> = ReadModelAction<Id, Metadata>>
  implements ProjectorGatewayFactory<SocketIoGatewayOptions, Id, Metadata, Action> {

  private openNamespace: {
    [namespace: string]: {
      socketNamespace: Namespace,
      gateway: ProjectorGatewayInterface<Id, Metadata, Action>,
    },
  } = {};

  constructor(private socketServer: Server,
              private serializer: SerializerInterface,
              private repository: StoreRepositoryInterface<State, Id, Metadata, Action>,
              /**
               * Throw an error to prevent connection to the namespace.
               */
              private onConnection: (connection: SocketConnection) => void) {
  }

  public open(options: SocketIoGatewayOptions): ProjectorGatewayInterface<Id, Metadata, Action> {
    const namespace = options.nsp;
    if (this.openNamespace[namespace]) {
      throw SocketIoGatewayFactoryError.alreadyOpen(namespace);
    }
    const socketNamespace = this.socketServer.of(namespace);
    const socketGateway = new ServerSocketIOGateway(socketNamespace, this.serializer);

    socketNamespace.use((socket: Socket, next) => {
      try {
        this.onConnection(new SocketConnection(socketGateway, options, socket));
        next();
      } catch (e) {
        next(new Error(e));
      }
    });

    const gateway = new SimpleProjectorGateway<State, Id, Metadata, Action>(this.repository, socketGateway);
    this.openNamespace[namespace] = {
      gateway,
      socketNamespace,
    };
    return gateway;
  }

  public close(options: SocketIoGatewayOptions): void {
    const namespace = options.nsp;
    if (!this.openNamespace[namespace]) {
      throw SocketIoGatewayFactoryError.notOpen(namespace);
    }
    const socketNamespace = this.openNamespace[namespace].socketNamespace;
    const connected = socketNamespace.connected;
    Object.keys(connected).forEach((client) => {
      connected[client].disconnect();
    });
    socketNamespace.removeAllListeners();
    delete this.socketServer.nsps[namespace];
    delete this.openNamespace[namespace];
  }

  public get(options: SocketIoGatewayOptions): ProjectorGatewayInterface<Id, Metadata, Action> {
    const namespace = options.nsp;
    if (!this.openNamespace[namespace]) {
      throw SocketIoGatewayFactoryError.notOpen(namespace);
    }
    return this.openNamespace[namespace].gateway;
  }

}
