import { EMPTY, fromEvent, merge, Observable } from 'rxjs';
import { isSerializableAction, SerializableAction } from '../../Redux/SerializableAction';
import { SerializerInterface } from '../../Serializer/SerializerInterface';
import { MalformedSerializableActionError } from '../Error/MalformedSerializableActionError';
import { SerializationError } from '../Error/SerializationError';
import { ServerGatewayInterface } from '../ServerGatewayInterface';
import { deserializeCommand } from '../Operators/deserializeCommand';
import { map } from 'rxjs/operators';
import { ServerGatewayMessage } from '../ValueObject/ServerGatewayMessage';
import { ServerGatewayMetadata } from '../ValueObject/ServerGatewayMetadata';
import { SerializableCommand } from '../../CommandHandling/SerializableCommand';
import { EntityMetadata } from '../../Redux/EntityMetadata';
import { SerializableQuery } from '../../QueryHandling/SerializableQuery';
import { deserializeQuery } from '../Operators/deserializeQuery';

export class NodeJSEventEmitterGateway<Metadata extends ServerGatewayMetadata<any> = { clientGateway: any }> implements ServerGatewayInterface<Metadata> {
  private readonly messages$: Observable<ServerGatewayMessage<Metadata>>;

  constructor(private emitter: NodeJS.EventEmitter,
              private serializer: SerializerInterface,
              metadata?: Metadata) {
    const clientMetadata: any = metadata ? metadata : { clientGateway: this };
    const serializedCommands$ = fromEvent<string>(this.emitter, 'command');
    const serializedQuery$ = fromEvent<string>(this.emitter, 'query');
    this.messages$ = merge(
      serializedCommands$
        .pipe(
          deserializeCommand(this.serializer),
          map((message: { command: SerializableCommand, metadata: EntityMetadata }) => {
            return {
              payload: message.command,
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
          map((message: { query: SerializableQuery, metadata: EntityMetadata }) => {
            return {
              payload: message.query,
              metadata: {
                ...message.metadata,
                ...(clientMetadata as any),
              },
            };
          }),
        ),
    );
  }

  public listen(): Observable<ServerGatewayMessage<Metadata>> {
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
