import { fromEvent, merge, Observable, of, throwError } from 'rxjs';
import { SerializableCommand } from '../../CommandHandling/SerializableCommand';
import { SerializableAction } from '../../Redux/SerializableAction';

import { SerializerInterface } from '../../Serializer/SerializerInterface';
import { SerializationError } from '../Error/SerializationError';
import { ClientGatewayInterface } from '../ClientGatewayInterface';
import { MalformedSerializableCommandError } from '../Error/MalformedSerializableCommandError';
import { filter, first, mapTo, mergeMap, share } from 'rxjs/operators';
import { deserializeAction } from '../Operators/deserializeAction';
import { EntityMetadata } from '../../Redux/EntityMetadata';
import { SerializableQuery } from '../../QueryHandling/SerializableQuery';
import { MalformedSerializableQueryError } from '../Error/MalformedSerializableQueryError';

export class ClientSocketIOGateway implements ClientGatewayInterface {

  private readonly actions$: Observable<SerializableAction>;
  private readonly connected$: Observable<Observable<SerializableAction>>;

  constructor(private socket: SocketIOClient.Socket,
              private serializer: SerializerInterface) {
    const serializedAction$ = fromEvent<string>(this.socket, 'action');
    const errors$ = merge(
      fromEvent<unknown>(this.socket, 'error'),
    ).pipe(
      mergeMap((error) => throwError(error)),
      share(),
    );

    this.actions$ = merge(
      errors$,
      serializedAction$.pipe(
        deserializeAction(serializer),
        share(),
      ),
    );

    this.connected$ = merge(
      of(this.socket.connected).pipe(filter(connected => connected)),
      fromEvent<unknown>(this.socket, 'connect').pipe(),
      errors$,
    )
      .pipe(
        first(),
        mapTo(this.actions$),
      );
  }

  public listen(): Promise<Observable<SerializableAction>> {
    return this.connected$.toPromise();
  }

  public async emit(serializable: SerializableCommand | SerializableQuery, metadata: EntityMetadata): Promise<void> {
    if (serializable instanceof SerializableCommand) {
      return this.emitCommand(serializable, metadata);
    }
    if (serializable instanceof SerializableQuery) {
      return this.emitQuery(serializable, metadata);
    }
    throw SerializationError.couldNotBeSerialized(serializable);
  }

  protected async emitCommand(command: SerializableCommand, metadata: EntityMetadata) {
    let serialized;
    if (!SerializableCommand.isSerializableCommand(command)) {
      throw MalformedSerializableCommandError.notASerializableCommand(command);
    }
    try {
      serialized = this.serializer.serialize({ command, metadata });
    } catch (e) {
      throw SerializationError.commandCouldNotBeSerialized(command, e);
    }
    this.socket.emit('command', serialized);
  }

  protected async emitQuery(query: SerializableQuery, metadata: EntityMetadata) {
    let serialized;
    if (!SerializableQuery.isSerializableQuery(query)) {
      throw MalformedSerializableQueryError.notASerializableQuery(query);
    }
    try {
      serialized = this.serializer.serialize({ query, metadata });
    } catch (e) {
      throw SerializationError.queryCouldNotBeSerialized(query, e);
    }
    this.socket.emit('query', serialized);
  }

}
