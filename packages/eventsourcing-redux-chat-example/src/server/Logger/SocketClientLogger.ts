import { AbstractLogger } from 'ts-eventsourcing/Logger/AbstractLogger';
import { LoggerInterface, LogLevel } from 'ts-eventsourcing/Logger/LoggerInterface';
import { Socket } from 'socket.io';

export class ClientLogger extends AbstractLogger {

  public static create(logger: LoggerInterface, client: Socket) {
    return new this(logger, client);
  }

  constructor(private logger: LoggerInterface, private client: Socket) {
    super();
  }

  public log(type: LogLevel, ...message: any[]): void {
    this.logger.log(type, [['Client', this.client.id, this.client.handshake.address, ':'].join(' '), ...message])
  }
}
