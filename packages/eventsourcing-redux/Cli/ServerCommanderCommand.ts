import { CommanderConfigurationInterface } from '@triviality/commander';
import { ClassUtil } from '@triviality/eventsourcing/ClassUtil';
import { CommandBus } from '@triviality/eventsourcing/CommandHandling/CommandBus';
import { QueryBus } from '@triviality/eventsourcing/QueryHandling/QueryBus';
import { LoggerInterface } from '@triviality/logger/LoggerInterface';
import { Command } from 'commander';
import * as http from 'http';
import { merge, of } from 'rxjs';
import { catchError, concatMap, tap } from 'rxjs/operators';
import { Socket } from 'socket.io';
import { convertCommandHandlerResponseToAction } from '../CommandHandling/Operator';
import { emitActionToClient } from '../Gateway/Operators/emitActionToClient';
import { ServerSocketIOGateway } from '../Gateway/socket.io/ServerSocketIOGateway';
import { ClientLogger } from '../Logger/SocketClientLogger';
import { convertQueryHandlerResponseToAction } from '../QueryHandling/Operator';

export class ServerCommanderCommand implements CommanderConfigurationInterface {

  constructor(private server: http.Server,
              private port: number,
              private gateway: ServerSocketIOGateway,
              private logger: LoggerInterface,
              private commandBus: CommandBus,
              private queryBus: QueryBus) {

  }

  public async configure(program: Command) {
    program
      .command('server')
      .description('bootstrap server')
      .action(() => {
        this
          .bootServerApplication()
          .catch((error) => {
            this.logger.error(error);
            process.exit(1);
          });
      });
  }

  public async bootServerApplication() {
    // tslint:disable-next-line:no-this-assignment
    const { gateway, logger, queryBus, commandBus } = this;

    function getClientLogger(client: Socket): LoggerInterface {
      return ClientLogger.create(logger, client);
    }

    gateway.connections().subscribe((message) => {
      getClientLogger(message.client).info('Connected');
    });
    gateway.disconnects().subscribe((message) => {
      getClientLogger(message.client).info('disconnected');
    });
    gateway.warnings().subscribe((message) => {
      logger.error(message);
    });

    gateway
      .listen()
      .pipe(
        concatMap((message) => {
          const clientLogger = getClientLogger(message.metadata.client);
          const message$ = of(message);
          clientLogger.info('Received message: ', ClassUtil.nameOffInstance(message.payload));
          return merge(
            message$.pipe(
              convertQueryHandlerResponseToAction((m) => queryBus.dispatch(m.payload)),
            ),
            message$.pipe(
              convertCommandHandlerResponseToAction((m) => commandBus.dispatch(m.payload)),
            ),
          ).pipe(
            emitActionToClient(message.gateway),
            tap((response) => {
              const error = response.metadata.error;
              if (error) {
                clientLogger.warn(`Failed with action response: "${response.type}" (${error})`);
              } else {
                clientLogger.info(`Response succeeded with action response: "${response.type}"`);
              }
            }),
          );
        }),
        // Last resort, gonna catch them all.
        catchError((error, observer) => {
          logger.error(error);
          return observer;
        }),
      ).subscribe();
    await this.startServer();
    this.logger.info(`listening on *:${this.port}`);
  }

  private startServer() {
    return new Promise((resolve) => {
      this.server.listen(this.port, resolve);
    });
  }
}
