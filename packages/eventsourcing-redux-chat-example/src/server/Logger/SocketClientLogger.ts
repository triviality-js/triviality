import { LoggerInterface } from '@triviality/logger/LoggerInterface';
import { PrefixLogger } from '@triviality/logger/PrefixLogger';
import { Socket } from 'socket.io';

export class ClientLogger extends PrefixLogger {

  public static create(logger: LoggerInterface, client: Socket) {
    return new this(logger, client);
  }

  constructor(logger: LoggerInterface, client: Socket) {
    super(logger, ['Client', client.id, client.handshake.address, ':'].join(' '));
  }
}
