import { SerializableCommand } from '../../CommandHandling/SerializableCommand';
import { SerializableQuery } from '../../QueryHandling/SerializableQuery';
import { EntityMetadata } from '../../Redux/EntityMetadata';
// tslint:disable-next-line
import type { ServerGatewayInterface } from '../ServerGatewayInterface';

export interface ServerGatewayMessage<Metadata extends EntityMetadata = EntityMetadata, ClientGateway extends ServerGatewayInterface<Metadata> = ServerGatewayInterface<Metadata>> {
  payload: SerializableCommand | SerializableQuery;
  metadata: Metadata;
  gateway: ClientGateway;
}
