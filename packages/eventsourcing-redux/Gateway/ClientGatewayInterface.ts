import { Observable } from 'rxjs';
import { SerializableCommand } from '../CommandHandling/SerializableCommand';
import { SerializableQuery } from '../QueryHandling/SerializableQuery';
import { EntityMetadata } from '../Redux/EntityMetadata';
import { SerializableAction } from '../Redux/SerializableAction';

export interface ClientGatewayInterface {
  emit(command: SerializableCommand | SerializableQuery, metadata: EntityMetadata): Promise<void>;

  /**
   * Resolved promise means the client is connected.
   */
  listen(): Observable<SerializableAction>;
}
