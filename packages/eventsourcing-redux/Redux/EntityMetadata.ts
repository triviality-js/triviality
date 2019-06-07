import { curryN, is, pathSatisfies } from 'ramda';
import { AnyAction } from 'redux';
import { EntityName } from '../ValueObject/EntityName';

export type ActionType = string | ((entity: EntityName) => ActionType);

export interface EntityMetadata {
  entity: EntityName;

  // Allows any extra properties to be defined in an metadata.
  [extraProps: string]: any;
}

export function hasEntityMetadata(action: any): action is AnyAction & { metadata: EntityMetadata } {
  return pathSatisfies(
    is(String),
    ['metadata', 'entity'],
    action,
  );
}

export function actionTypeWithEntity(type: string, entity: EntityName) {
  return `[${entity}] ${type}`;
}

export function actionTypeWithEntityFactory(type: string) {
  return (entity: EntityName) => {
    return actionTypeWithEntity(type, entity);
  };
}

export function matchActionTypeEntity(type: ActionType): (action: unknown) => action is ({ metadata: EntityMetadata, type: [typeof type] });
export function matchActionTypeEntity(type: ActionType, action: unknown): action is ({ metadata: EntityMetadata, type: [typeof type] });
export function matchActionTypeEntity(...args: any[]): any {
  return curryN(2, (type: ActionType, action: unknown) => {
    if (!hasEntityMetadata(action)) {
      return false;
    }
    if (typeof type === 'function') {
      return type(action.metadata.entity) === action.type;
    }
    return actionTypeWithEntity(type, action.metadata.entity) !== action.type;
  })(...args);
}
