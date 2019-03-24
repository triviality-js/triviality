import { CommandBus } from '@triviality/eventsourcing/CommandHandling/CommandBus';
import { Observable } from 'rxjs';
import { ServerGatewayMessage } from '../../Gateway/ValueObject/ServerGatewayMessage';
import { ServerGatewayMetadata } from '../../Gateway/ValueObject/ServerGatewayMetadata';
import { dispatchClientCommandOnCommandBus } from './dispatchClientCommandOnCommandBus';
import { emitCommandHandlerResponseOrErrorToClientGateway } from './emitCommandHandlerResponseOrErrorToClientGateway';

/**
 * Dispatch on command bus and emit success or error on client gateway.
 *
 * This operator is optional, keep in mind ALL errors and responses are send back to the client.
 * It's recommended to whitelist commands and errors that can be send back to the client.
 *
 *  emitCommandHandlerResponseOrErrorToClientGateway(
 *     (input) => input.pipe(
 *          dispatchClientCommandOnCommandBus(commandBus),
 *          // White list errors and results.
 *          filter((action: CommandAction) => {
 *              if (!(action.command instanceof YourCommand)) {
 *                return false;
 *              }
 *
 *              // Don't return any error.
 *              return !action.metadata.error;
 *          }),
 *     )
 *  ),
 *
 * @example
 *
 *  gateway
 *  .listen()
 *  .pipe(
 *    // Tap to see what commands is being received in
 *    tap((message) => {
 *        const client = message.metadata.client;
 *        console.log('Received command: ', ClassUtil.nameOffInstance(message.command));
 *    }),
 *
 *    // Pass to command the command bus.
 *    gatewayCommandBusAdapter(commandBus),
 *
 *    // Catch all errors related to the gateway, and try again.
 *    catchError((error, observer) => {
 *        console.error(error);
 *        return observer;
 *    })
 *  )
 *  .subscribe();
 */
export function gatewayCommandBusAdapter(commandBus: CommandBus) {
  return (input: Observable<ServerGatewayMessage<ServerGatewayMetadata<any>>>) => {
    return input.pipe(
        emitCommandHandlerResponseOrErrorToClientGateway(
          dispatchClientCommandOnCommandBus(commandBus),
        ),
    );
  };
}
