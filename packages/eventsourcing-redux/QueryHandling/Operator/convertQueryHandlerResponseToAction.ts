import { from, Observable, ObservableInput } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { ServerGatewayMessage } from '../../Gateway/ValueObject/ServerGatewayMessage';
import { hasEntityMetadata } from '../../Redux/EntityMetadata';
import { MissingEntityMetadataError } from '../../Redux/Error/MissingEntityMetadataError';
import { queryHandledFailed, queryHandledSuccessfully } from '../actions';
import { QueryAction } from '../QueryAction';
import { isQueryMessage } from './isQueryMessage';

/**
 * Handle query and convert to redux action.
 *
 * Keep in mind ALL errors and responses are added to the action.
 * It's recommended to whitelist errors that can be send back to the client.
 */
export function convertQueryHandlerResponseToAction<T extends ServerGatewayMessage>(
  handleMessage: (input: T) => ObservableInput<unknown>,
): (messages: Observable<T>) => Observable<QueryAction> {
  return (input: Observable<T>) =>
    input.pipe(
      isQueryMessage(),
      mergeMap(message =>
        from(handleMessage(message))
          .pipe(
            mergeMap(async (response: unknown) => {
              if (!hasEntityMetadata(message)) {
                throw MissingEntityMetadataError.forGatewayMessage(message);
              }
              return queryHandledSuccessfully(
                message.payload,
                message.metadata.entity,
                response,
              );
            }),
            catchError(async (error) => {
              if (!hasEntityMetadata(message)) {
                throw MissingEntityMetadataError.forGatewayMessage(message);
              }
              return queryHandledFailed(
                message.payload,
                message.metadata.entity,
                error,
              );
            }),
          )),
    );
}
