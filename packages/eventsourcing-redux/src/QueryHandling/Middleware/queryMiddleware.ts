import { AnyAction, Dispatch, MiddlewareAPI } from 'redux';
import { isQueryActionOfType } from '../QueryAction';
import {
  QUERY_HANDLING_FAILED, QUERY_TRANSMISSION_FAILED,
  QUERY_TRANSMITTING, queryFailed,
  queryTransmissionFailed,
  queryTransmittedSuccessfully,
} from '../actions';
import { ClientGatewayInterface } from '../../Gateway/ClientGatewayInterface';

export function queryMiddleware<D extends Dispatch = Dispatch, S = any, Action extends AnyAction = AnyAction>(gateway: ClientGatewayInterface) {
  return (api: MiddlewareAPI<D, S>) => (next: D) => (action: Action): any => {
    const response = next(action);
    if (isQueryActionOfType(action, QUERY_TRANSMITTING)) {
      gateway.emit(action.query, action.metadata)
        .then(() => {
          api.dispatch(queryTransmittedSuccessfully(action.query, action.metadata.entity, action.metadata));
        })
        .catch((error) => {
          api.dispatch(queryTransmissionFailed(action.query, action.metadata.entity, error, action.metadata));
        });
      if (
        isQueryActionOfType(action, QUERY_HANDLING_FAILED) ||
        isQueryActionOfType(action, QUERY_TRANSMISSION_FAILED)) {
        api.dispatch(queryFailed(action.query, action.metadata.entity, action.metadata));
      }
      return response;
    }
  };
}
