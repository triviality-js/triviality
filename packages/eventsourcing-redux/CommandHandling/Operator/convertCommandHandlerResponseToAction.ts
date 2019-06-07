import { from, Observable, ObservableInput } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { ServerGatewayMessage } from '../../Gateway/ValueObject/ServerGatewayMessage';
import { hasEntityMetadata } from '../../Redux/EntityMetadata';
import { MissingEntityMetadataError } from '../../Redux/Error/MissingEntityMetadataError';
import { commandHandledFailed, commandHandledSuccessfully } from '../actions';
import { CommandAction } from '../CommandAction';
import { isCommandMessage } from './index';

/**
 * Emit success or error action on client gateway.
 */
export const convertCommandHandlerResponseToAction = <T extends ServerGatewayMessage>(
  handleMessage: (input: T) => ObservableInput<unknown>,
) => (input: Observable<T>): Observable<CommandAction> =>
  input.pipe(
    isCommandMessage(),
    mergeMap((message) =>
      from(handleMessage(message))
        .pipe(
          mergeMap(async (response: unknown) => {
            if (!hasEntityMetadata(message)) {
              throw MissingEntityMetadataError.forGatewayMessage(message);
            }
            return commandHandledSuccessfully(
              message.payload,
              message.metadata.entity,
              response,
            );
          }),
          catchError(async (error) => {
            if (!hasEntityMetadata(message)) {
              throw MissingEntityMetadataError.forGatewayMessage(message);
            }
            return commandHandledFailed(
              message.payload,
              message.metadata.entity,
              error,
            );
          }),
        ),
    ),
  );
