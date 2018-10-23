import { AnyAction, Dispatch, MiddlewareAPI } from 'redux';
import { hasEntityMetadata } from 'eventsourcing-redux-bridge/Redux/EntityMetadata';
import { ACCOUNT_ENTITY_NAME, userLoggedIn, userLoggedOut } from './actions';
import { GATEWAY_ERROR, GATEWAY_IS_OPEN, gatewayClose, gatewayOpen } from 'eventsourcing-redux-bridge/Gateway/actions';
import { COMMAND_SUCCEEDED } from 'eventsourcing-redux-bridge/CommandHandling/actions';
import { asCommandAction } from 'eventsourcing-redux-bridge/CommandHandling/CommandAction';
import { UserRegisterCommand } from '../../server/Command/UserRegisterCommand';

export function accountMiddleware<D extends Dispatch = Dispatch, S = any, Action extends AnyAction = AnyAction>() {
  return (api: MiddlewareAPI<D, S>) => (next: D) => (action: Action): any => {
    const result = next(action);
    if (!hasEntityMetadata(action)) {
      return result;
    }

    switch (action.type) {
      case COMMAND_SUCCEEDED('register'):
        const domainAction = asCommandAction(action, UserRegisterCommand);
        const userId = domainAction.command.userId;
        api.dispatch(gatewayOpen(ACCOUNT_ENTITY_NAME, `/account/${userId.toString()}`, {
          userId,
        }));
        break;

      case GATEWAY_ERROR(ACCOUNT_ENTITY_NAME):
        api.dispatch(gatewayClose(ACCOUNT_ENTITY_NAME, action.gate));
        api.dispatch(userLoggedOut());
        break;

      case GATEWAY_IS_OPEN(ACCOUNT_ENTITY_NAME):
        api.dispatch(userLoggedIn(action.metadata.userId));
        break;
    }

    return result;
  };
}
