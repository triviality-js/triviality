import { ServerGatewayInterface } from '../ServerGatewayInterface';
import { Socket } from 'socket.io';
import { EMPTY, fromEvent, Observable, Subject } from 'rxjs';
import { catchError, finalize, map, mapTo, share, switchMap, takeUntil } from 'rxjs/operators';
import { SerializerInterface } from '../../Serializer/SerializerInterface';
import { SerializableAction } from '../../Redux/SerializableAction';
import { ServerGatewayMessage } from '../ValueObject/ServerGatewayMessage';
import { NodeJSEventEmitterGateway } from '../node.js/NodeJSEventEmitterGateway';
import { ServerGatewayMetadata } from '../ValueObject/ServerGatewayMetadata';

export interface ServerSocketIOGatewayMetadata extends ServerGatewayMetadata<ServerGatewayInterface<ServerSocketIOGatewayMetadata>> {
  client: Socket;
}

export type ServerSocketIOGatewayMessage = ServerGatewayMessage<ServerSocketIOGatewayMetadata>;

/**
 * Connect to different clients, client errors will be passed to the error stream.
 */
export class ServerSocketIOGateway implements ServerGatewayInterface<ServerSocketIOGatewayMetadata> {

  private readonly warnings$: Subject<ServerSocketIOGatewayMetadata & { error: Error }> = new Subject();
  private readonly message$: Observable<ServerGatewayMessage<ServerSocketIOGatewayMetadata>>;
  private readonly broadcastGateway: NodeJSEventEmitterGateway<any>;
  private readonly connections$: Observable<ServerSocketIOGatewayMetadata>;
  private readonly disconnect$: Observable<ServerSocketIOGatewayMetadata>;

  constructor(emitter: NodeJS.EventEmitter, serializer: SerializerInterface) {
    this.connections$ = fromEvent<Socket>(emitter, 'connection')
      .pipe(
        map((client) => {
          const metadata: ServerSocketIOGatewayMetadata = { client, clientGateway: undefined } as any;
          const clientGateway = new NodeJSEventEmitterGateway(client, serializer, metadata);
          metadata.clientGateway = clientGateway as any;
          return metadata as any;
        }),
        share(),
      );

    this.disconnect$ = this.connections$.pipe(
      switchMap((metadata: ServerSocketIOGatewayMetadata) => {
        return fromEvent(metadata.client, 'disconnect').pipe(
          mapTo(metadata),
        );
      }),
      share(),
    );

    this.message$ = this.connections$.pipe(
      switchMap((metadata: ServerSocketIOGatewayMetadata) => {
        const subscription = metadata.clientGateway.warnings().subscribe(this.warnings$);
        return metadata.clientGateway
          .listen()
          .pipe(
            takeUntil(fromEvent(metadata.client, 'disconnect')),
            finalize(() => {
              subscription.unsubscribe();
              metadata.client.disconnect();
            }),
            catchError((error) => {
              this.warnings$.next({ ...metadata, error });
              return EMPTY;
            }),
          );
      }),
      // All subscriber are now also listing to previous connected sockets.
      share(),
    );
    this.broadcastGateway = new NodeJSEventEmitterGateway(emitter, serializer, { clientGateway: emitter });
  }

  public async emit(action: SerializableAction): Promise<void> {
    return this.broadcastGateway.emit(action);
  }

  public listen(): Observable<ServerSocketIOGatewayMessage> {
    return this.message$;
  }

  public connections(): Observable<ServerSocketIOGatewayMetadata> {
    return this.connections$;
  }

  public disconnects(): Observable<ServerSocketIOGatewayMetadata> {
    return this.disconnect$;
  }

  public warnings(): Observable<ServerSocketIOGatewayMetadata & { error: Error }> {
    return this.warnings$;
  }

}
