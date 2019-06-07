import { SerializerInterface } from '@triviality/serializer';
import { fromEvent, merge, Observable, throwError } from 'rxjs';
import { mergeMap, share } from 'rxjs/operators';
import { SerializableCommand } from '../../CommandHandling/SerializableCommand';
import { SerializableQuery } from '../../QueryHandling/SerializableQuery';
import { EntityMetadata } from '../../Redux/EntityMetadata';
import { SerializableAction } from '../../Redux/SerializableAction';
import { ClientGatewayInterface } from '../ClientGatewayInterface';
import { MalformedSerializableCommandError } from '../Error/MalformedSerializableCommandError';
import { MalformedSerializableQueryError } from '../Error/MalformedSerializableQueryError';
import { SerializationError } from '../Error/SerializationError';
import { deserializeAction } from '../Operators/deserializeAction';

export class ClientSocketIOGateway implements ClientGatewayInterface {

  private readonly actions$: Observable<SerializableAction>;

  constructor(private socket: SocketIOClient.Socket,
              private serializer: SerializerInterface) {
    const serializedAction$ = fromEvent<string>(this.socket, 'action');
    const errors$ = fromEvent<unknown>(this.socket, 'error')
      .pipe(
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
  }

  public listen(): Observable<SerializableAction> {
    return this.actions$;
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
