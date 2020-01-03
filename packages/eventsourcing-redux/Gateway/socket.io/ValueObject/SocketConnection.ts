import { ServerSocketIOGateway } from '../ServerSocketIOGateway';
import { Socket } from 'socket.io';
import { ClientConnection } from '../../ValueObject/ClientConnection';
import { SocketIoGatewayOptions } from '../SocketIoGatewayOptions';

export class SocketConnection implements ClientConnection<SocketIoGatewayOptions, ServerSocketIOGateway> {
  constructor(public readonly gateway: ServerSocketIOGateway,
              public readonly options: SocketIoGatewayOptions,
              public readonly client: Socket) {
  }
}
