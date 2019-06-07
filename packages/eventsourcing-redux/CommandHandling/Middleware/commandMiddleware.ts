import { AnyAction, Dispatch, MiddlewareAPI } from 'redux';
import { isCommandActionOfType } from '../CommandAction';
import {
  COMMAND_HANDLING_FAILED,
  COMMAND_TRANSMISSION_FAILED,
  COMMAND_TRANSMITTING,
  commandFailed,
  commandTransmissionFailed,
  commandTransmittedSuccessfully,
} from '../actions';
import { ClientGatewayInterface } from '../../Gateway/ClientGatewayInterface';

export function commandMiddleware<D extends Dispatch = Dispatch, S = any, Action extends AnyAction = AnyAction>(gateway: ClientGatewayInterface) {
  return (api: MiddlewareAPI<D, S>) => (next: D) => (action: Action): any => {
    const response = next(action);
    if (isCommandActionOfType(action, COMMAND_TRANSMITTING)) {
      gateway.emit(action.command, action.metadata)
        .then(() => {
          api.dispatch(commandTransmittedSuccessfully(action.command, action.metadata.entity, action.metadata));
        })
        .catch((error) => {
          api.dispatch(commandTransmissionFailed(action.command, action.metadata.entity, error, action.metadata));
        });
    }
    if (
      isCommandActionOfType(action, COMMAND_HANDLING_FAILED) ||
      isCommandActionOfType(action, COMMAND_TRANSMISSION_FAILED)) {
      api.dispatch(commandFailed(action.command, action.metadata.entity, action.metadata));
    }
    return response;
  };
}
