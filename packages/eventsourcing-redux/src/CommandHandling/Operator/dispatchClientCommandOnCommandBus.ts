import { CommandBus } from '@triviality/eventsourcing/CommandHandling/CommandBus';
import { Observable } from 'rxjs';
import { ServerGatewayMessage } from '../../Gateway/ValueObject/ServerGatewayMessage';
import { ServerGatewayMetadata } from '../../Gateway/ValueObject/ServerGatewayMetadata';
import { filter, mergeMap } from 'rxjs/operators';
import { SerializableCommand } from '../SerializableCommand';

/**
 * Dispatch gateway messages to the command bus.
 */
export function dispatchClientCommandOnCommandBus(commandBus: CommandBus) {
  return (input: Observable<ServerGatewayMessage<ServerGatewayMetadata<any>>>): Observable<unknown> => {
    return input.pipe(
      filter((message) => message.payload instanceof SerializableCommand),
      mergeMap(async (message) => {
        return await commandBus.dispatch(message.payload);
      }),
    );
  };
}
