import { equals } from 'ramda';
import { Action } from 'redux';
import { ActionsObservable } from 'redux-observable';
import { concat, Observable, of } from 'rxjs';
import { catchError, filter, mergeMap, pluck, takeUntil } from 'rxjs/operators';
import { EntityMetadata } from '../../Redux/EntityMetadata';
import { withEntityName } from '../../Redux/Operators/EntityMetadata';
import { SerializableAction } from '../../Redux/SerializableAction';
import { EntityName } from '../../ValueObject/EntityName';
import { GATEWAY_CLOSE, GATEWAY_OPEN, gatewayError, gatewayIsClosed, gatewayIsOpen } from '../actions';
import { GatewayAction, isGatewayAction } from '../GatewayAction';

export function gatewayEpic<T, Metadata extends EntityMetadata, A extends Action = Action>(clients: (gate: T, metadata: Metadata) => Observable<SerializableAction>) {
  return (action$: ActionsObservable<A>): ActionsObservable<A> => {
    const openGatewayActions = action$
      .pipe(
        filter(isGatewayAction<T, Metadata>(GATEWAY_OPEN)),
        mergeMap(({ gate, metadata: { entity }, metadata }: GatewayAction<T, Metadata>) => {
          return concat(
            of(gatewayIsOpen<T>(entity, gate, metadata)),
            clients(gate as T, metadata)
              .pipe(
                catchError((error) =>
                  concat(
                    of(gatewayError(entity, gate, error)),
                    clients(gate as T, metadata),
                  ),
                ),
                takeUntil(action$.pipe(isClosed(entity, gate))),
              ),
            of(gatewayIsClosed(entity, gate, metadata)),
          );
        }),
      );
    return new ActionsObservable(openGatewayActions as any);
  };
}

function isClosed<T, Metadata extends EntityMetadata, A extends Action = Action>(entity: EntityName, gate: T) {
  return (action$: Observable<A>) => action$
    .pipe(
      filter(isGatewayAction<T, Metadata>(GATEWAY_CLOSE)),
      withEntityName(entity),
      pluck('gate'),
      filter(equals(gate)),
    );
}
