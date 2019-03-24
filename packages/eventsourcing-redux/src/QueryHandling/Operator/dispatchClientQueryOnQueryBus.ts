import { QueryBus } from '@triviality/eventsourcing/QueryHandling/QueryBus';
import { Observable } from 'rxjs';
import { ServerGatewayMessage } from '../../Gateway/ValueObject/ServerGatewayMessage';
import { ServerGatewayMetadata } from '../../Gateway/ValueObject/ServerGatewayMetadata';
import { filter, mergeMap } from 'rxjs/operators';
import { SerializableQuery } from '../SerializableQuery';

/**
 * Dispatch gateway messages to the query bus.
 */
export function dispatchClientQueryOnQueryBus(queryBus: QueryBus) {
  return (input: Observable<ServerGatewayMessage<ServerGatewayMetadata<any>>>): Observable<unknown> => {
    return input.pipe(
      filter((message) => message.payload instanceof SerializableQuery),
      mergeMap(async (message) => {
        return await queryBus.dispatch(message.payload);
      }),
    );
  };
}
