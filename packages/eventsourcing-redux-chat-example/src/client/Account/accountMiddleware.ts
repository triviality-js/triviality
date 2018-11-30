import { AnyAction, Dispatch, MiddlewareAPI } from 'redux';
import { hasEntityMetadata } from 'eventsourcing-redux-bridge/Redux/EntityMetadata';
import { ACCOUNT, queryAccountState, USER_REGISTRATION_SUCCEEDED, userLoggedOut } from './actions';
import { GATEWAY_ERROR, GATEWAY_IS_OPEN, gatewayClose, gatewayOpen } from 'eventsourcing-redux-bridge/Gateway/actions';
import { asCommandAction } from 'eventsourcing-redux-bridge/CommandHandling/CommandAction';
import { UserRegisterCommand } from '../../server/Command/UserRegisterCommand';

export function accountMiddleware<D extends Dispatch = Dispatch, S = any, Action extends AnyAction = AnyAction>() {
  return (api: MiddlewareAPI<D, S>) => (next: D) => (action: Action): any => {
    const result = next(action);
    if (!hasEntityMetadata(action)) {
      return result;
    }

    switch (action.type) {
      case USER_REGISTRATION_SUCCEEDED:
        const domainAction = asCommandAction(action, UserRegisterCommand);
        const userId = domainAction.command.userId;
        api.dispatch(gatewayOpen(action.metadata.entity, `/account/${userId.toString()}`, {
          userId,
        }));
        break;

      case GATEWAY_ERROR(ACCOUNT):
        api.dispatch(gatewayClose(ACCOUNT, action.gate));
        api.dispatch(userLoggedOut());
        break;

      case GATEWAY_IS_OPEN(ACCOUNT):
        api.dispatch(queryAccountState(action.metadata.userId));
        break;

    }

    return result;
  };
}
