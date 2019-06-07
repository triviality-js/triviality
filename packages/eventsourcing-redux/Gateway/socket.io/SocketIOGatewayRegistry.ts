import { SerializerInterface } from '@triviality/serializer';
import { InMemoryKeyValueStore } from '@triviality/storage';
import * as socketIo from 'socket.io-client';
import { GatewayRegistry } from '../GatewayRegistry';
import { ClientSocketIOGateway } from './ClientSocketIOGateway';

export class SocketIOGatewayRegistry implements GatewayRegistry<string> {

  private sockets = new InMemoryKeyValueStore<ClientSocketIOGateway, string>();

  constructor(private serializer: SerializerInterface) {

  }

  public get(path: string) {
    if (this.sockets.has(path)) {
      return this.sockets.get(path);
    }
    const socket = socketIo.connect(path);
    const gateway = new ClientSocketIOGateway(socket, this.serializer);
    this.sockets.set(path, gateway);
    return gateway;
  }

}
