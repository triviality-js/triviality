import { Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { commandHandledFailed, commandHandledSuccessfully } from '../actions';
import { ServerGatewayMessage } from '../../Gateway/ValueObject/ServerGatewayMessage';
import { ServerGatewayMetadata } from '../../Gateway/ValueObject/ServerGatewayMetadata';
import { fromClientCommand } from './fromClientCommand';
import { hasEntityMetadata } from '../../Redux/EntityMetadata';
import { MissingEntityMetadataError } from '../../Redux/Error/MissingEntityMetadataError';
import { CommandAction } from '../CommandAction';

/**
 * Emit success or error action on client gateway.
 */
export function emitCommandHandlerResponseOrErrorToClientGateway<T extends ServerGatewayMessage<ServerGatewayMetadata<any>>>(
  handleMessages$: (input: Observable<T>) => Observable<unknown>,
  convertError: (error: unknown) => unknown = (error) => error,
) {
  return (input: Observable<T>): Observable<CommandAction> => {
    return input.pipe(
      fromClientCommand((clientGateway, message) => {
        return () => {
          const response$ = handleMessages$(of(message));
          return response$
            .pipe(
              mergeMap(async (response: unknown) => {
                if (!hasEntityMetadata(message)) {
                  throw MissingEntityMetadataError.forGatewayMessage(message);
                }
                const successAction = commandHandledSuccessfully(
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
                const failedAction = commandHandledFailed(
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
