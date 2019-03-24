import { ServerGatewayInterface } from '../ServerGatewayInterface';
import { EntityMetadata } from '../../Redux/EntityMetadata';

export interface ServerGatewayMetadata<ClientGateway extends ServerGatewayInterface<any>> extends Partial<EntityMetadata> {
  clientGateway: ClientGateway;
}
