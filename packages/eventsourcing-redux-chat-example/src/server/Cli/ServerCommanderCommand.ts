import { CommanderConfigurationInterface } from '@triviality/commander';
import { dispatchClientCommandOnCommandBus } from '@triviality/eventsourcing-redux/CommandHandling/Operator/dispatchClientCommandOnCommandBus';
import { emitCommandHandlerResponseOrErrorToClientGateway } from '@triviality/eventsourcing-redux/CommandHandling/Operator/emitCommandHandlerResponseOrErrorToClientGateway';
import { ServerSocketIOGateway } from '@triviality/eventsourcing-redux/Gateway/socket.io/ServerSocketIOGateway';
import { dispatchClientQueryOnQueryBus } from '@triviality/eventsourcing-redux/QueryHandling/Operator/dispatchClientQueryOnQueryBus';
import { emitQueryHandlerResponseOrErrorToClientGateway } from '@triviality/eventsourcing-redux/QueryHandling/Operator/emitQueryHandlerResponseOrErrorToClientGateway';
import { ClassUtil } from '@triviality/eventsourcing/ClassUtil';
import { CommandBus } from '@triviality/eventsourcing/CommandHandling/CommandBus';
import { QueryBus } from '@triviality/eventsourcing/QueryHandling/QueryBus';
import { LoggerInterface } from '@triviality/logger/LoggerInterface';
import { Command } from 'commander';
import * as http from 'http';
import { merge, of } from 'rxjs';
import { catchError, concatMap, tap } from 'rxjs/operators';
import { Socket } from 'socket.io';
import { ClientLogger } from '../Logger/SocketClientLogger';

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
    const gateway = this.gateway;
    const logger = this.logger;

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
          const messages$ = of(message);
          clientLogger.info('Received message: ', ClassUtil.nameOffInstance(message.payload));
          return merge(
            messages$
              .pipe(
                emitCommandHandlerResponseOrErrorToClientGateway(
                  dispatchClientCommandOnCommandBus(this.commandBus),
                  this.convertError,
                ),
              ),
            messages$
              .pipe(
                emitQueryHandlerResponseOrErrorToClientGateway(
                  dispatchClientQueryOnQueryBus(this.queryBus),
                  this.convertError,
                ),
              ),
          ).pipe(
            tap((response) => {
              const error = response.metadata.error;
              if (error) {
                clientLogger.warn(`Failed with action response: "${response.type}" (${error})`);
              } else {
                clientLogger.info(`Response succeeded with action response: "${response.type}"`);
              }
            }),
            catchError((error, observer) => {
              // Catch error specific to this message & client.
              clientLogger.error(error);
              return observer;
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

  private convertError = (error: unknown): unknown => {
    return `${error}`;
  };

  private startServer() {
    return new Promise((resolve) => {
      this.server.listen(this.port, resolve);
    });
  }
}
