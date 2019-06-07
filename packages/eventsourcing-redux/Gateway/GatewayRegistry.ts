import { EntityMetadata } from '../Redux/EntityMetadata';
import { ClientGatewayInterface } from './ClientGatewayInterface';

export interface GatewayRegistry<T, Metadata extends EntityMetadata = EntityMetadata> {
  get(gate: T, metadata: Metadata): ClientGatewayInterface;
}
