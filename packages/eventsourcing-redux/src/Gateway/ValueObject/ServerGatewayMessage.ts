import { SerializableCommand } from '../../CommandHandling/SerializableCommand';
import { ServerGatewayInterface } from '../ServerGatewayInterface';
import { ServerGatewayMetadata } from './ServerGatewayMetadata';
import { SerializableQuery } from '../../QueryHandling/SerializableQuery';

export interface ServerGatewayMessage<Metadata extends ServerGatewayMetadata<ServerGatewayInterface<Metadata>>> {
  payload: SerializableCommand | SerializableQuery;
  metadata: Metadata;
}
