import { EntityMetadata, matchActionTypeEntity } from '../Redux/EntityMetadata';
import { EntityName } from '../ValueObject/EntityName';

export interface GatewayAction<T, Metadata extends EntityMetadata = EntityMetadata> {
  type: string;
  metadata: Metadata;
  gate: T;
}

export function isGatewayAction<T, Metadata extends EntityMetadata = EntityMetadata>(action: unknown, type: (entity: EntityName) => string): action is GatewayAction<T, Metadata> {
  return matchActionTypeEntity(action, type);
}
