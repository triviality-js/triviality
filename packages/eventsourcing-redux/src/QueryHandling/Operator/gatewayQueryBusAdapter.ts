import { QueryBus } from '@triviality/eventsourcing/QueryHandling/QueryBus';
import { Observable } from 'rxjs';
import { ServerGatewayMessage } from '../../Gateway/ValueObject/ServerGatewayMessage';
import { ServerGatewayMetadata } from '../../Gateway/ValueObject/ServerGatewayMetadata';
import { dispatchClientQueryOnQueryBus } from './dispatchClientQueryOnQueryBus';
import { emitQueryHandlerResponseOrErrorToClientGateway } from './emitQueryHandlerResponseOrErrorToClientGateway';

/**
 * Dispatch on query bus and emit success or error on client gateway.
 *
 * Keep in mind ALL errors and responses are send back to the client.
 * It's recommended to whitelist queries and errors that can be send back to the client.
 *
 *  emitQueryHandlerResponseOrErrorToClientGateway(
 *     (input) => input.pipe(
 *          dispatchClientQueryOnQueryBus(queryBus),
 *          // White list errors and results.
 *          filter((action: QueryAction) => {
 *              if (!(action.query instanceof YourQuery)) {
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
 *    // Tap to see what queries is being received in
 *    tap((message) => {
 *        const client = message.metadata.client;
 *        console.log('Received query: ', ClassUtil.nameOffInstance(message.query));
 *    }),
 *
 *    // Pass to query the query bus.
 *    gatewayQueryBusAdapter(queryBus),
 *
 *    // Catch all errors related to the gateway, and try again.
 *    catchError((error, observer) => {
 *        console.error(error);
 *        return observer;
 *    })
 *  )
 *  .subscribe();
 */
export function gatewayQueryBusAdapter(queryBus: QueryBus) {
  return (input: Observable<ServerGatewayMessage<ServerGatewayMetadata<any>>>) => {
    return input.pipe(
        emitQueryHandlerResponseOrErrorToClientGateway(
          dispatchClientQueryOnQueryBus(queryBus),
        ),
    );
  };
}
