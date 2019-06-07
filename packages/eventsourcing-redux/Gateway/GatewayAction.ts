import { curryN, both, has } from 'ramda';
import { EntityMetadata, matchActionTypeEntity } from '../Redux/EntityMetadata';
import { EntityName } from '../ValueObject/EntityName';

export interface GatewayAction<T, Metadata extends EntityMetadata = EntityMetadata> {
  type: string;
  metadata: Metadata;
  gate: T;
}

export function isGatewayAction<T, Metadata extends EntityMetadata = EntityMetadata>(type: (entity: EntityName) => string): (action: unknown) => action is GatewayAction<T, Metadata>;
export function isGatewayAction<T, Metadata extends EntityMetadata = EntityMetadata>(type: (entity: EntityName) => string, action: unknown): action is GatewayAction<T, Metadata>;
export function isGatewayAction(...args: any[]): any {
  return curryN(2, (type: (entity: EntityName) => string, action: unknown) => {
    return both(
      matchActionTypeEntity(type),
      has('gate'),
    )(action);
  })(...args);
}
