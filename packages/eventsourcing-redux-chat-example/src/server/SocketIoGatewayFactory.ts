import { StoreRepositoryInterface } from 'eventsourcing-redux-bridge/ReadModel/StoreRepositoryInterface';
import { ServerSocketIOGateway } from 'eventsourcing-redux-bridge/Gateway/socket.io/ServerSocketIOGateway';
import { ProjectorGateway } from 'eventsourcing-redux-bridge/ReadModel/ProjectorGateway';
import { Namespace, Server } from 'socket.io';
import { SerializableAction } from 'eventsourcing-redux-bridge/Redux/SerializableAction';
import { SerializerInterface } from 'eventsourcing-redux-bridge/Serializer/SerializerInterface';
import { EntityName } from 'eventsourcing-redux-bridge/ValueObject/EntityName';
import { Identity } from 'ts-eventsourcing/ValueObject/Identity';

export interface ProjectorGatewayFactory<T, S, Id extends Identity, A extends SerializableAction = SerializableAction> {
  open(options: T): ProjectorGateway<S, Id, A>;

  get(options: T): ProjectorGateway<S, Id, A>;

  close(options: T): void;
}

class SocketIoGatewayFactoryError extends Error {

  public static alreadyOpen(namespace: string) {
    return new this(`Socket with ${namespace} already open`);
  }

  public static notOpen(namespace: string) {
    return new this(`Socket with ${namespace} is not open`);
  }

}


export class SocketIoGatewayFactory<S, Id extends Identity, A extends SerializableAction = SerializableAction>
  implements ProjectorGatewayFactory<string, S, Id, A> {

  private openNamespace: {
    [namespace: string]: {
      socketNamespace: Namespace,
      gateway: ProjectorGateway<S, Id, A>,
    }
  } = {};

  constructor(private socketServer: Server,
              private serializer: SerializerInterface,
              private entityName: EntityName,
              private repository: StoreRepositoryInterface<S, Id, A>) {
  }

  public open(namespace: string): ProjectorGateway<S, Id, A> {
    if (this.openNamespace[namespace]) {
      throw SocketIoGatewayFactoryError.alreadyOpen(namespace);
    }
    const socketNamespace = this.socketServer.of(namespace);
    const socketGateway = new ServerSocketIOGateway(socketNamespace, this.serializer);
    const gateway = new ProjectorGateway<S, Id, A>(this.repository, socketGateway, this.entityName);
    this.openNamespace[namespace] = {
      gateway,
      socketNamespace,
    };
    return gateway;
  }

  public close(namespace: string): void {
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

  public get(namespace: string): ProjectorGateway<S, Id, A> {
    if (!this.openNamespace[namespace]) {
      throw SocketIoGatewayFactoryError.notOpen(namespace);
    }
    return this.openNamespace[namespace].gateway;
  }

}
