import { ClassUtil } from '@triviality/eventsourcing/ClassUtil';
import { Query, QueryConstructor } from '@triviality/eventsourcing/QueryHandling/Query';
import { ClassConstructor } from '@triviality/serializer';
import { actionTypeWithEntity, EntityMetadata, hasEntityMetadata } from '../Redux/EntityMetadata';
import { EntityName } from '../ValueObject/EntityName';
import { InvalidQueryTypeError } from './Error/InvalidQueryTypeError';
import { SerializableQuery } from './SerializableQuery';

export interface QueryAction<T extends SerializableQuery = SerializableQuery, Metadata = {}> {
  type: string;
  metadata: EntityMetadata & Metadata;
  query: T;
}

export interface QueryResponseAction<T extends SerializableQuery = SerializableQuery, Response = any, Metadata = {}> extends QueryAction<T, Metadata> {
  response: Response;
}

export function isQueryAction(action: any): action is QueryAction {
  return action &&
    hasEntityMetadata(action) &&
    SerializableQuery.isSerializableQuery(action.query);
}

export function isQueryActionOfType(action: any, type: (entity: string, query: QueryConstructor | Query) => string): action is QueryAction {
  return isQueryAction(action) && type(action.metadata.entity, action.query) === action.type;
}

export function queryActionTypeFactory(type: string) {
  return (entity: EntityName, query: QueryConstructor | Query) => {
    return actionTypeWithEntity(`[${ClassUtil.nameOff(query)}] ${type}`, entity);
  };
}

export function asQueryAction<T extends SerializableQuery = SerializableQuery, Metadata = {}>(
  action: any,
  query: QueryConstructor<T>,
): QueryAction<T, Metadata> {
  if (!isQueryAction(action)) {
    throw InvalidQueryTypeError.actionIsNotAnQueryAction();
  }
  if (!(action.query instanceof query)) {
    throw InvalidQueryTypeError.doesNotMatchQuery(action.query, query);
  }
  return action as any;
}

export function asQueryActionWithResponse<T extends SerializableQuery = SerializableQuery, Response = any, Metadata = {}>(
  action: any,
  query: QueryConstructor<T>,
  responseClass?: ClassConstructor<Response>,
): QueryResponseAction<T, Metadata, Response> {
  if (!isQueryAction(action)) {
    throw InvalidQueryTypeError.actionIsNotAnQueryAction();
  }
  if (!(action.query instanceof query)) {
    throw InvalidQueryTypeError.doesNotMatchQuery(action.query, query);
  }
  const response = (action as any).response;
  if (typeof response === 'undefined') {
    throw InvalidQueryTypeError.doesNotHaveResponse(action.query);
  }
  if (responseClass && !(response instanceof responseClass)) {
    throw InvalidQueryTypeError.doesNotHaveCorrectResponse(action.query, responseClass);
  }
  return action as any;
}
