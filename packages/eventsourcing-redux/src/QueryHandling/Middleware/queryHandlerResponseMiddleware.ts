import { AnyAction, Dispatch, MiddlewareAPI } from 'redux';

import { Observable, throwError, Subject, merge } from 'rxjs';
import { timeout, filter, map, share, concatMap, take, takeUntil } from 'rxjs/operators';
import {
  QUERY_FAILED,
  QUERY_SUCCEEDED,
  QUERY_TRANSMITTING,
} from '../actions';
import {
  QueryAction,
  isQueryAction,
  isQueryActionOfType,
  QueryResponseAction,
} from '../QueryAction';
import { withEntityName } from '../../Redux/Operators/EntityMetadata';
import { ofType } from '../../Redux/Operators/Action';

export function isQueriestatusSubscribable<T>(action: unknown): action is QueryAction<T> {
  return isQueryActionOfType(action, QUERY_TRANSMITTING) && action.metadata.listenToQueryHandler;
}

/**
 * Send events to query observer, so current status of a transmitted query can be watched everywhere in the application.
 *
 * This is optional and only available when the server sends query handlers responses back. {@see gatewayQueryBusAdapter}
 * how to configure this.
 */
export function queryHandlerResponseMiddleware<D extends Dispatch = Dispatch, S = any, Action extends AnyAction = AnyAction>(
  timeoutTime: number = 5000,
) {
  const handleQueryActions$ = new Subject<Action>();
  const queryActions$ = handleQueryActions$.pipe(
    filter(nextAction => isQueryAction(nextAction)),
    map((action: any) => action as QueryAction),
    share(),
  );

  return (_api: MiddlewareAPI<D, S>) => (next: D) => (action: Action): any => {

    handleQueryActions$.next(action);

    if (isQueriestatusSubscribable(action)) {
      const entity = action.metadata.entity;
      const query = action.query;
      const queriesForEntity$: Observable<QueryAction> = queryActions$.pipe(
        withEntityName(entity),
        share(),
      );

      const response$ = queriesForEntity$.pipe(
        ofType(QUERY_SUCCEEDED(entity, query)),
        take(1),
        map((nextQueryAction) => nextQueryAction as QueryResponseAction),
        map((nextQueryAction) => {
          return nextQueryAction.response;
        }),
        share(),
      );

      const errors$ = queriesForEntity$.pipe(
        // If we don't got an event in time, throw an error.
        timeout(timeoutTime),
        // Or throw when one of the following event are given.
        ofType(
          QUERY_FAILED(entity, query),
        ),
        concatMap((nextQueryAction) => {
          return throwError(nextQueryAction.metadata.error);
        }),
        takeUntil(response$),
      );

      const promise = merge(errors$, response$).toPromise();
      next(action);
      return promise;
    }

    return next(action);
  };
}
