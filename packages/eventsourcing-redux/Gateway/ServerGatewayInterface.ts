import { Observable } from 'rxjs';
import { EntityMetadata } from '../Redux/EntityMetadata';
import { SerializableAction } from '../Redux/SerializableAction';
import { ServerGatewayMessage } from './ValueObject/ServerGatewayMessage';

export interface ServerGatewayInterface<Metadata extends EntityMetadata = EntityMetadata> {
  emit(action: SerializableAction): Promise<void>;

  listen(): Observable<ServerGatewayMessage<Metadata, this>>;

  warnings(): Observable<Metadata & { error: Error }>;
}
