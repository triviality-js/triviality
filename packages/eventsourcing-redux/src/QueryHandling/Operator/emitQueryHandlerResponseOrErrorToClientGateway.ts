import { Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { queryHandledFailed, queryHandledSuccessfully } from '../actions';
import { ServerGatewayMessage } from '../../Gateway/ValueObject/ServerGatewayMessage';
import { ServerGatewayMetadata } from '../../Gateway/ValueObject/ServerGatewayMetadata';
import { fromClientQuery } from './fromClientQuery';
import { hasEntityMetadata } from '../../Redux/EntityMetadata';
import { MissingEntityMetadataError } from '../../Redux/Error/MissingEntityMetadataError';
import { QueryAction } from '../QueryAction';

/**
 * Emit success or error action on client gateway.
 */
export function emitQueryHandlerResponseOrErrorToClientGateway<T extends ServerGatewayMessage<ServerGatewayMetadata<any>>>(
  handleMessages$: (input: Observable<T>) => Observable<unknown>,
  convertError: (error: unknown) => unknown = (error) => error,
) {
  return (input: Observable<T>): Observable<QueryAction> => {
    return input.pipe(
      fromClientQuery((clientGateway, message) => {
        return () => {
          const response$ = handleMessages$(of(message));
          return response$
            .pipe(
              mergeMap(async (response: unknown) => {
                if (!hasEntityMetadata(message)) {
                  throw MissingEntityMetadataError.forGatewayMessage(message);
                }
                const successAction = queryHandledSuccessfully(
                  message.payload,
                  message.metadata.entity,
                  response,
                );
                await clientGateway.emit(successAction);
                return successAction;
              }),
              catchError(async (error) => {
                if (!hasEntityMetadata(message)) {
                  throw MissingEntityMetadataError.forGatewayMessage(message);
                }
                const failedAction = queryHandledFailed(
                  message.payload,
                  message.metadata.entity,
                  convertError(error),
                );
                await clientGateway.emit(failedAction);
                return failedAction;
              }),
            );
        };
      }),
    );
  };
}
