import 'source-map-support/register';
import { Socket } from 'socket.io';
import { ClientLogger } from './Logger/SocketClientLogger';
import { catchError, share, tap } from 'rxjs/operators';
import { ClassUtil } from 'ts-eventsourcing/ClassUtil';
import { dispatchClientCommandOnCommandBus } from 'eventsourcing-redux-bridge/CommandHandling/Operator/dispatchClientCommandOnCommandBus';
import { emitCommandHandlerResponseOrErrorToClientGateway } from 'eventsourcing-redux-bridge/CommandHandling/Operator/emitCommandHandlerResponseOrErrorToClientGateway';
import { emitQueryHandlerResponseOrErrorToClientGateway } from 'eventsourcing-redux-bridge/QueryHandling/Operator/emitQueryHandlerResponseOrErrorToClientGateway';
import { dispatchClientQueryOnQueryBus } from 'eventsourcing-redux-bridge/QueryHandling/Operator/dispatchClientQueryOnQueryBus';
import { merge } from 'rxjs';
import { LoggerInterface } from 'triviality-logger/LoggerInterface';
import { ContainerFactory } from 'triviality';
import { CommonModule } from '../shared/CommonModule';
import { EventSourcingModule } from './EventSourcingModule';
import { UserModule } from './UserModule';
import { WebModule } from './WebModule';
import { ChatChannelModule } from './ChatChannelModule';

ContainerFactory
  .create()
  .add(CommonModule)
  .add(EventSourcingModule)
  .add(WebModule)
  .add(UserModule)
  .add(ChatChannelModule)
  .build()
  .then((container) => {
    const logger = container.logger();
    const gateway = container.serverGateway();
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
      logger.warn(message);
    });
    gateway
      .listen()
      .pipe(
        // See what queries/commands are being received.
        tap((message) => {
          getClientLogger(message.metadata.client).info('Received message: ', ClassUtil.nameOffInstance(message.payload));
        }),
        share(),
        ((messages$) => {
          return merge(
            messages$
              .pipe(
                emitCommandHandlerResponseOrErrorToClientGateway(
                  dispatchClientCommandOnCommandBus(container.commandBus()),
                ),
              ),
            messages$
              .pipe(
                emitQueryHandlerResponseOrErrorToClientGateway(
                  dispatchClientQueryOnQueryBus(container.queryBus()),
                ),
              ),
          );
        }),
        catchError((error, observer) => {
          // Catch all errors related to the gateway, and try again.
          logger.error(error);
          return observer;
        }),
      ).subscribe();

    // Start listing to the server.
    container
      .httpServer()
      .listen(3000, () => {
        logger.info('listening on *:3000');
      });
  });
