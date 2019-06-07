import { SerializerInterface } from '@triviality/serializer';
import { EMPTY, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SerializableCommand } from '../../CommandHandling/SerializableCommand';
import { SerializableQuery } from '../../QueryHandling/SerializableQuery';
import { EntityMetadata } from '../../Redux/EntityMetadata';
import { isSerializableAction, SerializableAction } from '../../Redux/SerializableAction';
import { MalformedSerializableActionError } from '../Error/MalformedSerializableActionError';
import { SerializationError } from '../Error/SerializationError';
import { deserializeCommand } from '../Operators/deserializeCommand';
import { deserializeQuery } from '../Operators/deserializeQuery';
import { ServerGatewayInterface } from '../ServerGatewayInterface';
import { ServerGatewayMessage } from '../ValueObject/ServerGatewayMessage';

export class NodeJSEventEmitterGateway<Metadata extends EntityMetadata = EntityMetadata> implements ServerGatewayInterface<Metadata> {
  private readonly messages$: Observable<ServerGatewayMessage<Metadata, this>>;

  constructor(private emitter: NodeJS.EventEmitter,
              private serializer: SerializerInterface,
              metadata?: Partial<Metadata>) {
    const clientMetadata: any = metadata ? metadata : { };
    const serializedCommands$ = fromEvent<string>(this.emitter, 'command');
    const serializedQuery$ = fromEvent<string>(this.emitter, 'query');
    this.messages$ = merge(
      serializedCommands$
        .pipe(
          deserializeCommand(this.serializer),
          map((message: { command: SerializableCommand, metadata: EntityMetadata }): ServerGatewayMessage<Metadata> => {
            return {
              payload: message.command,
              gateway: this,
              metadata: {
                ...message.metadata,
                ...(clientMetadata as any),
              },
            };
          }),
        ),
      serializedQuery$
        .pipe(
          deserializeQuery(this.serializer),
          map((message: { query: SerializableQuery, metadata: EntityMetadata }): ServerGatewayMessage<Metadata> => {
            return {
              payload: message.query,
              gateway: this,
              metadata: {
                ...message.metadata,
                ...(clientMetadata as any),
              },
            };
          }),
        ),
    ) as any;
  }

  public listen(): Observable<ServerGatewayMessage<Metadata, this>> {
    return this.messages$;
  }

  public warnings(): Observable<Metadata & { error: Error }> {
    return EMPTY;
  }

  public async emit(action: SerializableAction): Promise<void> {
    let serialized;
    if (!isSerializableAction(action)) {
      throw MalformedSerializableActionError.notASerializableAction(action);
    }
    try {
      serialized = this.serializer.serialize(action);
    } catch (e) {
      throw SerializationError.actionCouldNotBeSerialized(action, e);
    }
    this.emitter.emit('action', serialized);
  }

}
